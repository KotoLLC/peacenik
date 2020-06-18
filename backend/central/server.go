package central

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/gorilla/sessions"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/handler"
	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/central/service"
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
	services       service.Services
	repos          repo.Repos
	tokenGenerator token.Generator
	sessionStore   *sessions.CookieStore
}

func NewServer(listenAddr, pubKeyPEM string, services service.Services, repos repo.Repos, tokenGenerator token.Generator) *Server {
	sessionStore := sessions.NewCookieStore([]byte(cookieAuthenticationKey))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.MaxAge = 0

	return &Server{
		listenAddr:     listenAddr,
		pubKeyPEM:      pubKeyPEM,
		services:       services,
		repos:          repos,
		tokenGenerator: tokenGenerator,
		sessionStore:   sessionStore,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcHooks := &twirp.ServerHooks{}
	baseService := service.NewBaseService(s.repos)

	authService := service.NewAuth(baseService, sessionUserKey)
	authServiceHandler := rpc.NewAuthServiceServer(authService, rpcHooks)
	r.Handle(authServiceHandler.PathPrefix()+"*", s.authSessionProvider(authServiceHandler))

	infoService := service.NewInfo(baseService, s.pubKeyPEM)
	infoServiceHandler := rpc.NewInfoServiceServer(infoService, rpcHooks)
	r.Handle(infoServiceHandler.PathPrefix()+"*", infoServiceHandler)

	tokenService := service.NewToken(baseService, s.tokenGenerator)
	tokenServiceHandler := rpc.NewTokenServiceServer(tokenService, rpcHooks)
	r.Handle(tokenServiceHandler.PathPrefix()+"*", s.checkAuth(tokenServiceHandler))

	r.Mount("/invite", s.checkAuth(handler.Invite(s.services.Invite)))
	r.Mount("/friends", s.checkAuth(handler.Friend(s.repos.Friend)))
	r.Mount("/nodes", s.checkAuth(handler.Node(s.services.Node, s.repos.Node)))

	log.Println("started on " + s.listenAddr)
	return http.ListenAndServe(s.listenAddr, r)
}

func (s *Server) setupMiddlewares(r *chi.Mux) {
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
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

		ctx := context.WithValue(r.Context(), service.ContextUserKey, *user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) authSessionProvider(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessionStore.Get(r, sessionName)
		var sessionWrapper service.Session = &sessionWrapper{
			session: session,
			w:       w,
			r:       r,
		}
		ctx := context.WithValue(r.Context(), service.ContextSession, sessionWrapper)
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
