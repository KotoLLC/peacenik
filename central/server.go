package central

import (
	"context"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/gorilla/sessions"

	"github.com/mreider/koto/central/handler"
	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
)

const (
	cookieAuthenticationKey = "oSKDA9fDNa6jIHArw8MHGBPe0XZm4hnY"
	sessionName             = "auth-session"
	sessionUserKey          = "user-id"
)

type Repos struct {
	User      repo.UserRepo
	Relations repo.RelationRepo
}

type Services struct {
	Info   service.InfoService
	User   service.UserService
	Invite service.InviteService
}

type Server struct {
	port         int
	services     Services
	repos        Repos
	sessionStore *sessions.CookieStore
}

func NewServer(port int, services Services, repos Repos) *Server {
	sessionStore := sessions.NewCookieStore([]byte(cookieAuthenticationKey))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.MaxAge = 0

	return &Server{
		port:         port,
		services:     services,
		repos:        repos,
		sessionStore: sessionStore,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	r.Mount("/info", handler.Info(s.services.Info))
	r.Mount("/auth", handler.Auth(s.checkAuth, s.services.User, s.sessionStore, sessionName, sessionUserKey))
	r.Mount("/invite", s.checkAuth(handler.Invite(s.services.Invite)))

	listenAddr := ":" + strconv.Itoa(s.port)
	log.Println("started on " + listenAddr)
	return http.ListenAndServe(listenAddr, r)
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
