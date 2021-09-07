package userhub

import (
	"context"
	"embed"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"strings"

	"github.com/ansel1/merry"
	"github.com/appleboy/go-fcm"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/sessions"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/bcrypt"
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/routers"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services"
)

//go:embed _templates/email
var emailTemplateFS embed.FS

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
	userCache      caches.Users
	tokenGenerator token.Generator
	tokenParsers   *services.TokenParsers
	s3Storage      *common.S3Storage
	sessionStore   *sessions.CookieStore
	staticFS       http.FileSystem
}

func NewServer(cfg config.Config, pubKeyPEM string, repos repo.Repos, userCache caches.Users, tokenGenerator token.Generator, tokenParsers *services.TokenParsers, s3Storage *common.S3Storage,
	staticFS http.FileSystem) *Server {
	sessionStore := sessions.NewCookieStore([]byte(cookieAuthenticationKey))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.MaxAge = int(services.SessionDefaultMaxAge.Seconds())

	return &Server{
		cfg:            cfg,
		pubKeyPEM:      pubKeyPEM,
		repos:          repos,
		userCache:      userCache,
		tokenGenerator: tokenGenerator,
		tokenParsers:   tokenParsers,
		s3Storage:      s3Storage,
		sessionStore:   sessionStore,
		staticFS:       staticFS,
	}
}

func (s *Server) Run() error {
	rootEmailTemplate, err := common.ParseTemplates(emailTemplateFS, "_templates/email")
	if err != nil {
		return err
	}

	r := chi.NewRouter()
	s.setupMiddlewares(r)

	r.Mount("/image", s.checkAuth(routers.Image(s.repos, s.userCache, s.s3Storage, s.staticFS), "/image/user/"))

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
	notificationSender := services.NewNotificationSender(s.repos, s.userCache, firebaseClient, mailSender, rootEmailTemplate)
	notificationSender.Start()

	baseService := services.NewBase(s.repos, services.BaseServiceOptions{
		UserCache:          s.userCache,
		S3Storage:          s.s3Storage,
		TokenGenerator:     s.tokenGenerator,
		TokenParsers:       s.tokenParsers,
		MailSender:         mailSender,
		Cfg:                s.cfg,
		NotificationSender: notificationSender,
		RootEmailTemplate:  rootEmailTemplate,
	})
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
	r.Handle(tokenServiceHandler.PathPrefix()+"*", s.checkAuth(tokenServiceHandler, "/rpc.TokenService/GetPublicMessages"))

	userService := services.NewUser(baseService, passwordHash)
	userServiceHandler := rpc.NewUserServiceServer(userService, rpcOptions...)
	r.Handle(userServiceHandler.PathPrefix()+"*", s.checkAuth(userServiceHandler, "/rpc.UserService/User"))

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

	messageHubInternalService := services.NewMessageHubInternal(baseService)
	messageHubInternalServiceHandler := rpc.NewMessageHubInternalServiceServer(messageHubInternalService, rpcOptions...)
	r.Handle(messageHubInternalServiceHandler.PathPrefix()+"*", s.checkHubAuth(messageHubInternalServiceHandler))

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
		user := s.repos.User.FindUserByID(userID)
		if user == nil {
			next.ServeHTTP(w, r)
			return
		}
		if len(user.PasswordHash) < len(userPasswordHash) ||
			user.PasswordHash[len(user.PasswordHash)-len(userPasswordHash):] != userPasswordHash {
			next.ServeHTTP(w, r)
			return
		}

		userInfo := s.userCache.UserFullAccess(user.ID)
		isAdmin := s.cfg.IsAdmin(userInfo.Name)

		ctx := context.WithValue(r.Context(), services.ContextUserKey, *user)
		ctx = context.WithValue(ctx, services.ContextIsAdminKey, isAdmin)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) checkAuth(next http.Handler, skipCheckPaths ...string) http.Handler {
	return s.findSessionUser(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for _, p := range skipCheckPaths {
			if p == r.URL.Path || (strings.HasSuffix(p, "/") && strings.HasPrefix(r.URL.Path, p)) {
				next.ServeHTTP(w, r)
				return
			}
		}

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
		userInfo := s.userCache.UserFullAccess(user.ID)
		isAdmin := s.cfg.IsAdmin(userInfo.Name) || s.cfg.IsAdmin(userInfo.Email)
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

func (s *Server) checkHubAuth(next http.Handler) http.Handler {
	const bearerPrefix = "bearer "
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizationToken := r.Header.Get("Authorization")
		if authorizationToken == "" || !strings.HasPrefix(strings.ToLower(authorizationToken), bearerPrefix) {
			http.Error(w, "", http.StatusUnauthorized)
			return
		}
		rawToken := authorizationToken[len(bearerPrefix):]
		_, claims, err := s.tokenParsers.Primary().ParseUnverified(rawToken)
		hubAddress := claims["id"].(string)

		_, claims, err = s.tokenParsers.Hub(r.Context(), hubAddress).Parse(rawToken, "auth")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		hubAddress = claims["id"].(string)
		ctx := context.WithValue(r.Context(), services.ContextHubKey, hubAddress)
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
