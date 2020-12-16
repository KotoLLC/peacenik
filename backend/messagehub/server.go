package messagehub

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/ansel1/merry"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
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
	db             *sqlx.DB
}

func NewServer(cfg config.Config, repos repo.Repos, tokenParser token.Parser, s3Storage *common.S3Storage,
	tokenGenerator token.Generator, pubKeyPEM string, db *sqlx.DB) *Server {
	return &Server{
		cfg:            cfg,
		repos:          repos,
		tokenParser:    tokenParser,
		s3Storage:      s3Storage,
		tokenGenerator: tokenGenerator,
		pubKeyPEM:      pubKeyPEM,
		db:             db,
	}
}

func (s *Server) Run() error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r := chi.NewRouter()
	s.setupMiddlewares(r)

	rpcOptions := []interface{}{
		&twirp.ServerHooks{
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
		},
		twirp.WithServerPathPrefix(""),
	}

	notificationSender := services.NewNotificationSender(s.repos.Notification, s.cfg.ExternalAddress,
		fmt.Sprintf("%s/rpc.MessageHubNotificationService/PostNotifications", s.cfg.UserHubAddress),
		s.tokenGenerator)
	notificationSender.Start()
	baseService := services.NewBase(s.repos, s.tokenParser, s.cfg.ExternalAddress, s.s3Storage, notificationSender)

	messageService := services.NewMessage(baseService)
	messageServiceHandler := rpc.NewMessageServiceServer(messageService, rpcOptions...)
	r.Handle(messageServiceHandler.PathPrefix()+"*", s.checkAuth(messageServiceHandler))

	blobService := services.NewBlob(baseService)
	blobServiceHandler := rpc.NewBlobServiceServer(blobService, rpcOptions...)
	r.Handle(blobServiceHandler.PathPrefix()+"*", s.checkAuth(blobServiceHandler))

	notificationService := services.NewNotification(baseService)
	notificationServiceHandler := rpc.NewNotificationServiceServer(notificationService, rpcOptions...)
	r.Handle(notificationServiceHandler.PathPrefix()+"*", s.checkAuth(notificationServiceHandler))

	infoService := services.NewInfo(baseService, s.pubKeyPEM)
	infoServiceHandler := rpc.NewInfoServiceServer(infoService, rpcOptions...)
	r.Handle(infoServiceHandler.PathPrefix()+"*", infoServiceHandler)

	userService := services.NewUser(baseService)
	userServiceHandler := rpc.NewUserServiceServer(userService, rpcOptions...)
	r.Handle(userServiceHandler.PathPrefix()+"*", userServiceHandler)

	destroy := false
	adminService := services.NewAdmin(baseService, &destroy)
	adminServiceHandler := rpc.NewAdminServiceServer(adminService, rpcOptions...)
	r.Handle(adminServiceHandler.PathPrefix()+"*", s.checkAuth(adminServiceHandler))

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT)
	signal.Notify(stop, syscall.SIGTERM)

	httpServer := &http.Server{
		Addr:    s.cfg.ListenAddress,
		Handler: r,
	}

	go func() {
		log.Println("started on " + s.cfg.ListenAddress)
		if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalln(err)
		}
	}()

	<-stop

	log.Println("Shutting down...")

	ctxShutdown, cancelShutdown := context.WithTimeout(ctx, 20*time.Second)
	defer cancelShutdown()

	err := httpServer.Shutdown(ctxShutdown)
	if err != nil {
		log.Println("can't shutdown:", err)
	}

	if destroy {
		s.deleteS3Bucket(ctx)
		s.dropDatabase(ctx)
	}

	return nil
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
		userFullName, _ := claims["full_name"].(string)
		var isHubAdmin bool
		var blockedUsers []string
		if ownedHubs, ok := claims["owned_hubs"].([]interface{}); ok {
			for _, hub := range ownedHubs {
				if hub.(string) == s.cfg.ExternalAddress {
					isHubAdmin = true
					break
				}
			}
		}
		if rawBlockedUsers, ok := claims["blocked_users"].([]interface{}); ok {
			for _, id := range rawBlockedUsers {
				blockedUsers = append(blockedUsers, id.(string))
			}
		}

		user, err := s.repos.User.AddUser(userID, userName, userFullName)
		if err != nil {
			log.Println(err)
		}

		ctx := context.WithValue(r.Context(), services.ContextUserKey, services.User{
			ID:           userID,
			Name:         userName,
			IsHubAdmin:   isHubAdmin,
			IsBlocked:    user.BlockedAt.Valid,
			BlockedUsers: blockedUsers,
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) deleteS3Bucket(ctx context.Context) {
	key := os.Getenv("KOTO_S3_KEY")
	secret := os.Getenv("KOTO_S3_SECRET")
	endpoint := os.Getenv("KOTO_S3_ENDPOINT")
	bucket := os.Getenv("KOTO_S3_BUCKET")

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(key, secret, ""),
		Endpoint:    aws.String(endpoint),
		Region:      aws.String("us-east-1"), // https://github.com/aws/aws-sdk-go/issues/2232
	}

	newSession, err := session.NewSession(s3Config)
	if err != nil {
		log.Println("can't create S3 session:", err)
		return
	}
	client := s3.New(newSession)

	iter := s3manager.NewDeleteListIterator(client, &s3.ListObjectsInput{
		Bucket: aws.String(bucket),
	})
	err = s3manager.NewBatchDeleteWithClient(client).Delete(ctx, iter)
	if err != nil {
		log.Println("can't delete S3 bucket objects:", err)
	}

	deleteBucketParams := &s3.DeleteBucketInput{
		Bucket: aws.String(bucket),
	}
	_, err = client.DeleteBucket(deleteBucketParams)
	if err != nil {
		log.Println("can't delete S3 bucket:", err)
	}
}

func (s *Server) dropDatabase(ctx context.Context) {
	err := s.db.Close()
	if err != nil {
		log.Println("can't close db:", err)
	}

	cfg := s.cfg.DB
	dbName := cfg.DBName
	cfg.DBName = "postgres"
	db, _, err := common.OpenDatabase(cfg)
	if err != nil {
		log.Println("can't open postgres db:", err)
		return
	}

	_, err = db.ExecContext(ctx, `drop database "`+dbName+`" with (force);`)
	if err != nil {
		log.Println("can't drop db:", err)
	}
}
