package userhub

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"

	"github.com/ansel1/merry"
	"github.com/appleboy/go-fcm"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/sessions"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/bcrypt"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/routers"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services"
)

const (
	cookieAuthenticationKey    = "oSKDA9fDNa6jIHArw8MHGBPe0XZm4hnY"
	sessionName                = "auth-session"
	sessionUserKey             = "user-id"
	sessionUserPasswordHashKey = "user-password"
)

type Server struct {
	cfg            config.Config
	pubKeyPEM      string
	repos          repo.Repos
	tokenGenerator token.Generator
	tokenParser    token.Parser
	s3Storage      *common.S3Storage
	sessionStore   *sessions.CookieStore
	staticFS       http.FileSystem
}

func NewServer(cfg config.Config, pubKeyPEM string, repos repo.Repos, tokenGenerator token.Generator, tokenParser token.Parser, s3Storage *common.S3Storage,
	staticFS http.FileSystem) *Server {
	sessionStore := sessions.NewCookieStore([]byte(cookieAuthenticationKey))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.MaxAge = int(services.SessionDefaultMaxAge.Seconds())

	return &Server{
		cfg:            cfg,
		pubKeyPEM:      pubKeyPEM,
		repos:          repos,
		tokenGenerator: tokenGenerator,
		tokenParser:    tokenParser,
		s3Storage:      s3Storage,
		sessionStore:   sessionStore,
		staticFS:       staticFS,
	}
}

func (s *Server) Run() error {
	r := chi.NewRouter()
	s.setupMiddlewares(r)

	r.Mount("/image", routers.Image(s.repos, s.s3Storage, s.staticFS))

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

	mailSender := common.NewMailSender(s.cfg.SMTP)
	var firebaseClient *fcm.Client
	if s.cfg.FirebaseToken != "" {
		var err error
		firebaseClient, err = fcm.NewClient(s.cfg.FirebaseToken)
		if err != nil {
			return merry.Prepend(err, "can't create Firebase client")
		}
	}
	notificationSender := services.NewNotificationSender(s.repos, firebaseClient, mailSender)
	notificationSender.Start()
	baseService := services.NewBase(s.repos, s.s3Storage, s.tokenGenerator, s.tokenParser, mailSender,
		s.cfg, notificationSender)
	notificationSender.SetGetUserAttachments(baseService.GetUserAttachments)

	passwordHash := bcrypt.NewPasswordHash()

	authService := services.NewAuth(baseService, sessionUserKey, sessionUserPasswordHashKey, passwordHash, s.cfg.TestMode, s.cfg.AdminList(), s.cfg.AdminFriendship)
	authServiceHandler := rpc.NewAuthServiceServer(authService, rpcOptions...)
	r.Handle(authServiceHandler.PathPrefix()+"*", s.findSessionUser(s.authSessionProvider(authServiceHandler)))

	infoService := services.NewInfo(baseService, s.pubKeyPEM)
	infoServiceHandler := rpc.NewInfoServiceServer(infoService, rpcOptions...)
	r.Handle(infoServiceHandler.PathPrefix()+"*", infoServiceHandler)

	tokenService := services.NewToken(baseService, s.tokenGenerator, s.cfg.TokenDuration())
	tokenServiceHandler := rpc.NewTokenServiceServer(tokenService, rpcOptions...)
	r.Handle(tokenServiceHandler.PathPrefix()+"*", s.checkAuth(tokenServiceHandler))

	userService := services.NewUser(baseService, passwordHash)
	userServiceHandler := rpc.NewUserServiceServer(userService, rpcOptions...)
	r.Handle(userServiceHandler.PathPrefix()+"*", s.checkAuth(userServiceHandler))

	messageHubService := services.NewMessageHub(baseService, s.cfg.AdminList())
	messageHubServiceHandler := rpc.NewMessageHubServiceServer(messageHubService, rpcOptions...)
	r.Handle(messageHubServiceHandler.PathPrefix()+"*", s.checkAuth(messageHubServiceHandler))

	inviteService := services.NewInvite(baseService)
	inviteServiceHandler := rpc.NewInviteServiceServer(inviteService, rpcOptions...)
	r.Handle(inviteServiceHandler.PathPrefix()+"*", s.checkAuth(inviteServiceHandler))

	blobService := services.NewBlob(baseService)
	blobServiceHandler := rpc.NewBlobServiceServer(blobService, rpcOptions...)
	r.Handle(blobServiceHandler.PathPrefix()+"*", s.checkAuth(blobServiceHandler))

	notificationService := services.NewNotification(baseService)
	notificationServiceHandler := rpc.NewNotificationServiceServer(notificationService, rpcOptions...)
	r.Handle(notificationServiceHandler.PathPrefix()+"*", s.checkAuth(notificationServiceHandler))

	messageHubNotificationService := services.NewMessageHubNotification(baseService)
	messageHubNotificationServiceHandler := rpc.NewMessageHubNotificationServiceServer(messageHubNotificationService, rpcOptions...)
	r.Handle(messageHubNotificationServiceHandler.PathPrefix()+"*", messageHubNotificationServiceHandler)

	groupService := services.NewGroup(baseService)
	groupServiceHandler := rpc.NewGroupServiceServer(groupService, rpcOptions...)
	r.Handle(groupServiceHandler.PathPrefix()+"*", s.checkAuth(groupServiceHandler))

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
		AllowCredentials: true,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	}
	r.Use(cors.New(corsOptions).Handler)
}

func (s *Server) findSessionUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, _ := s.sessionStore.Get(r, sessionName)
		userID, ok := session.Values[sessionUserKey].(string)
		if !ok {
			next.ServeHTTP(w, r)
			return
		}
		userPasswordHash, ok := session.Values[sessionUserPasswordHashKey].(string)
		if !ok || userPasswordHash == "" {
			next.ServeHTTP(w, r)
			return
		}
		user, err := s.repos.User.FindUserByID(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if user == nil {
			next.ServeHTTP(w, r)
			return
		}
		if len(user.PasswordHash) < len(userPasswordHash) ||
			user.PasswordHash[len(user.PasswordHash)-len(userPasswordHash):] != userPasswordHash {
			next.ServeHTTP(w, r)
			return
		}

		isAdmin := s.cfg.IsAdmin(user.Name)

		ctx := context.WithValue(r.Context(), services.ContextUserKey, *user)
		ctx = context.WithValue(ctx, services.ContextIsAdminKey, isAdmin)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) checkAuth(next http.Handler) http.Handler {
	return s.findSessionUser(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: remove
		if r.URL.Path == "/rpc.UserService/RegisterFCMToken" {
			requestDump, err := httputil.DumpRequest(r, true)
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(string(requestDump))
		}

		user, ok := r.Context().Value(services.ContextUserKey).(repo.User)
		if !ok {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}
		isAdmin := s.cfg.IsAdmin(user.Name) || s.cfg.IsAdmin(user.Email)
		if !isAdmin && !user.ConfirmedAt.Valid && r.URL.Path != "/rpc.UserService/Me" {
			http.Error(w, "", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	}))
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

func (s *sessionWrapper) Save(options services.SessionSaveOptions) error {
	s.session.Options.MaxAge = int(options.MaxAge.Seconds())
	return s.session.Save(s.r, s.w)
}
