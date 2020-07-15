package central

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/sessions"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/bcrypt"
	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/central/services"
	"github.com/mreider/koto/backend/token"
)

const (
	cookieAuthenticationKey = "oSKDA9fDNa6jIHArw8MHGBPe0XZm4hnY"
	sessionName             = "auth-session"
	sessionUserKey          = "user-id"
)

type Server struct {
	listenAddr     string
	pubKeyPEM      string
	admins         map[string]bool
	repos          repo.Repos
	tokenGenerator token.Generator
	tokenDuration  time.Duration
	sessionStore   *sessions.CookieStore
}

func NewServer(listenAddr, pubKeyPEM string, admins map[string]bool, repos repo.Repos, tokenGenerator token.Generator, tokenDuration time.Duration) *Server {
	sessionStore := sessions.NewCookieStore([]byte(cookieAuthenticationKey))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.MaxAge = 0

	return &Server{
		listenAddr:     listenAddr,
		pubKeyPEM:      pubKeyPEM,
		admins:         admins,
		repos:          repos,
		tokenGenerator: tokenGenerator,
		tokenDuration:  tokenDuration,
		sessionStore:   sessionStore,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcHooks := &twirp.ServerHooks{}
	baseService := services.NewBase(s.repos)

	passwordHash := bcrypt.NewPasswordHash()

	authService := services.NewAuth(baseService, sessionUserKey, passwordHash)
	authServiceHandler := rpc.NewAuthServiceServer(authService, rpcHooks)
	r.Handle(authServiceHandler.PathPrefix()+"*", s.authSessionProvider(authServiceHandler))

	infoService := services.NewInfo(baseService, s.pubKeyPEM)
	infoServiceHandler := rpc.NewInfoServiceServer(infoService, rpcHooks)
	r.Handle(infoServiceHandler.PathPrefix()+"*", infoServiceHandler)

	tokenService := services.NewToken(baseService, s.tokenGenerator, s.tokenDuration)
	tokenServiceHandler := rpc.NewTokenServiceServer(tokenService, rpcHooks)
	r.Handle(tokenServiceHandler.PathPrefix()+"*", s.checkAuth(tokenServiceHandler))

	userService := services.NewUser(baseService)
	userServiceHandler := rpc.NewUserServiceServer(userService, rpcHooks)
	r.Handle(userServiceHandler.PathPrefix()+"*", s.checkAuth(userServiceHandler))

	nodeService := services.NewNode(baseService)
	nodeServiceHandler := rpc.NewNodeServiceServer(nodeService, rpcHooks)
	r.Handle(nodeServiceHandler.PathPrefix()+"*", s.checkAuth(nodeServiceHandler))

	inviteService := services.NewInvite(baseService)
	inviteServiceHandler := rpc.NewInviteServiceServer(inviteService, rpcHooks)
	r.Handle(inviteServiceHandler.PathPrefix()+"*", s.checkAuth(inviteServiceHandler))

	log.Println("started on " + s.listenAddr)
	return http.ListenAndServe(s.listenAddr, r)
}

func (s *Server) setupMiddlewares(r *chi.Mux) {
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	corsOptions := cors.Options{
		AllowOriginFunc: func(r *http.Request, origin string) bool {
			return true
		},
		AllowCredentials: true,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	}
	r.Use(cors.New(corsOptions).Handler)
}

func (s *Server) checkAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessionStore.Get(r, sessionName)
		userID, ok := session.Values[sessionUserKey].(string)
		if !ok {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}
		user, err := s.repos.User.FindUserByID(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if user == nil {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), services.ContextUserKey, *user)
		ctx = context.WithValue(ctx, services.ContextIsAdminKey, s.admins[user.Name] || s.admins[user.Email])
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) authSessionProvider(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessionStore.Get(r, sessionName)
		var sessionWrapper services.Session = &sessionWrapper{
			session: session,
			w:       w,
			r:       r,
		}
		ctx := context.WithValue(r.Context(), services.ContextSession, sessionWrapper)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type sessionWrapper struct {
	session *sessions.Session
	w       http.ResponseWriter
	r       *http.Request
}

func (s *sessionWrapper) SetValue(key, value interface{}) {
	s.session.Values[key] = value
}

func (s *sessionWrapper) Clear() {
	s.session.Values = nil
}

func (s *sessionWrapper) Save() error {
	return s.session.Save(s.r, s.w)
}
