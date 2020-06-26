package node

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/rpc"
	"github.com/mreider/koto/backend/node/services"
	"github.com/mreider/koto/backend/token"
)

type Server struct {
	internalAddr    string
	externalAddress string
	repos           repo.Repos
	tokenParser     token.Parser
}

func NewServer(internalAddr, externalAddress string, repos repo.Repos, tokenParser token.Parser) *Server {
	return &Server{
		internalAddr:    internalAddr,
		externalAddress: externalAddress,
		repos:           repos,
		tokenParser:     tokenParser,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcHooks := &twirp.ServerHooks{}
	baseService := services.NewBase(s.repos, s.tokenParser, s.externalAddress)

	messageService := services.NewMessage(baseService)
	messageServiceHandler := rpc.NewMessageServiceServer(messageService, rpcHooks)
	r.Handle(messageServiceHandler.PathPrefix()+"*", s.checkAuth(messageServiceHandler))

	log.Println("started on " + s.internalAddr)
	return http.ListenAndServe(s.internalAddr, r)
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
		ctx := context.WithValue(r.Context(), services.ContextUserKey, services.User{ID: userID})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
