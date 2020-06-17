package node

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"

	"github.com/mreider/koto/backend/node/handler"
	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/service"
	"github.com/mreider/koto/backend/token"
)

type Repos struct {
	Message repo.MessageRepo
}

type Services struct {
}

type Server struct {
	internalAddr    string
	externalAddress string
	tokenParser     token.Parser
	services        Services
	repos           Repos
}

func NewServer(internalAddr, externalAddress string, tokenParser token.Parser, services Services, repos Repos) *Server {
	return &Server{
		internalAddr:    internalAddr,
		externalAddress: externalAddress,
		tokenParser:     tokenParser,
		services:        services,
		repos:           repos,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	r.Mount("/messages", s.checkAuth(handler.Message(s.externalAddress, s.tokenParser, s.repos.Message)))

	log.Println("started on " + s.internalAddr)
	return http.ListenAndServe(s.internalAddr, r)
}

func (s *Server) setupMiddlewares(r *chi.Mux) {
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
}

func (s *Server) checkAuth(next http.Handler) http.Handler {
	const bearerPrefix = "Bearer "
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizationToken := r.Header.Get("Authorization")
		if authorizationToken == "" || !strings.HasPrefix(authorizationToken, bearerPrefix) {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}
		rawToken := strings.TrimPrefix(authorizationToken, bearerPrefix)
		_, claims, err := s.tokenParser.Parse(rawToken, "auth")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		userID := claims["id"].(string)
		ctx := context.WithValue(r.Context(), service.ContextUserKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
