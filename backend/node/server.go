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

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node/config"
	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/rpc"
	"github.com/mreider/koto/backend/node/services"
	"github.com/mreider/koto/backend/token"
)

type Server struct {
	cfg         config.Config
	repos       repo.Repos
	tokenParser token.Parser
	s3Storage   *common.S3Storage
}

func NewServer(cfg config.Config, repos repo.Repos, tokenParser token.Parser, s3Storage *common.S3Storage) *Server {
	return &Server{
		cfg:         cfg,
		repos:       repos,
		tokenParser: tokenParser,
		s3Storage:   s3Storage,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcHooks := &twirp.ServerHooks{}
	baseService := services.NewBase(s.repos, s.tokenParser, s.cfg.ExternalAddress, s.s3Storage)

	messageService := services.NewMessage(baseService)
	messageServiceHandler := rpc.NewMessageServiceServer(messageService, rpcHooks)
	r.Handle(messageServiceHandler.PathPrefix()+"*", s.checkAuth(messageServiceHandler))

	blobService := services.NewBlob(baseService)
	blobServiceHandler := rpc.NewBlobServiceServer(blobService, rpcHooks)
	r.Handle(blobServiceHandler.PathPrefix()+"*", s.checkAuth(blobServiceHandler))

	log.Println("started on " + s.cfg.ListenAddress)
	return http.ListenAndServe(s.cfg.ListenAddress, r)
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
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete},
		AllowedHeaders: []string{"*"},
	}
	r.Use(cors.New(corsOptions).Handler)
}

func (s *Server) checkAuth(next http.Handler) http.Handler {
	const bearerPrefix = "bearer "
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizationToken := r.Header.Get("Authorization")
		if authorizationToken == "" || !strings.HasPrefix(strings.ToLower(authorizationToken), bearerPrefix) {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}
		rawToken := authorizationToken[len(bearerPrefix):]
		_, claims, err := s.tokenParser.Parse(rawToken, "auth")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		userID := claims["id"].(string)
		userName, _ := claims["name"].(string)
		ctx := context.WithValue(r.Context(), services.ContextUserKey, services.User{ID: userID, Name: userName})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
