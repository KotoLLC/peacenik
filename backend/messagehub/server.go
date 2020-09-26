package messagehub

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/ansel1/merry"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/messagehub/config"
	"github.com/mreider/koto/backend/messagehub/repo"
	"github.com/mreider/koto/backend/messagehub/rpc"
	"github.com/mreider/koto/backend/messagehub/services"
	"github.com/mreider/koto/backend/token"
)

type Server struct {
	cfg            config.Config
	repos          repo.Repos
	tokenParser    token.Parser
	s3Storage      *common.S3Storage
	tokenGenerator token.Generator
	pubKeyPEM      string
}

func NewServer(cfg config.Config, repos repo.Repos, tokenParser token.Parser, s3Storage *common.S3Storage,
	tokenGenerator token.Generator, pubKeyPEM string) *Server {
	return &Server{
		cfg:            cfg,
		repos:          repos,
		tokenParser:    tokenParser,
		s3Storage:      s3Storage,
		tokenGenerator: tokenGenerator,
		pubKeyPEM:      pubKeyPEM,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcHooks := &twirp.ServerHooks{
		Error: func(ctx context.Context, err twirp.Error) context.Context {
			cause := errors.Unwrap(err)
			if cause != nil {
				if err.Code() == twirp.Internal {
					log.Print(merry.Details(cause))
				} else {
					sourceLine := merry.SourceLine(cause)
					if sourceLine != "" {
						log.Printf("%s: %s\n", cause, sourceLine)
					}
				}
			} else {
				log.Println(err)
			}
			return ctx
		},
	}

	notificationSender := services.NewNotificationSender(s.repos.Notification, s.cfg.ExternalAddress,
		fmt.Sprintf("%s/rpc.MessageHubNotificationService/PostNotifications", s.cfg.UserHubAddress),
		s.tokenGenerator)
	notificationSender.Start()
	baseService := services.NewBase(s.repos, s.tokenParser, s.cfg.ExternalAddress, s.s3Storage, notificationSender)

	messageService := services.NewMessage(baseService)
	messageServiceHandler := rpc.NewMessageServiceServer(messageService, rpcHooks)
	r.Handle(messageServiceHandler.PathPrefix()+"*", s.checkAuth(messageServiceHandler))

	blobService := services.NewBlob(baseService)
	blobServiceHandler := rpc.NewBlobServiceServer(blobService, rpcHooks)
	r.Handle(blobServiceHandler.PathPrefix()+"*", s.checkAuth(blobServiceHandler))

	notificationService := services.NewNotification(baseService)
	notificationServiceHandler := rpc.NewNotificationServiceServer(notificationService, rpcHooks)
	r.Handle(notificationServiceHandler.PathPrefix()+"*", s.checkAuth(notificationServiceHandler))

	infoService := services.NewInfo(baseService, s.pubKeyPEM)
	infoServiceHandler := rpc.NewInfoServiceServer(infoService, rpcHooks)
	r.Handle(infoServiceHandler.PathPrefix()+"*", infoServiceHandler)

	log.Println("started on " + s.cfg.ListenAddress)
	return http.ListenAndServe(s.cfg.ListenAddress, r)
}

func (s *Server) setupMiddlewares(r *chi.Mux) {
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))

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
		var isHubAdmin bool
		if ownedHubs, ok := claims["owned_hubs"].([]interface{}); ok {
			for _, hub := range ownedHubs {
				if hub.(string) == s.cfg.ExternalAddress {
					isHubAdmin = true
					break
				}
			}
		}

		err = s.repos.User.AddUser(userID, userName)
		if err != nil {
			log.Println(err)
		}

		ctx := context.WithValue(r.Context(), services.ContextUserKey, services.User{
			ID:         userID,
			Name:       userName,
			IsHubAdmin: isHubAdmin,
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
