package handler

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/gorilla/sessions"

	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Auth(userService service.UserService, sessionStore *sessions.CookieStore, sessionName, sessionUserKey string) http.Handler {
	h := &authHandlers{
		userService:    userService,
		sessionStore:   sessionStore,
		sessionName:    sessionName,
		sessionUserKey: sessionUserKey,
	}
	r := chi.NewRouter()
	r.Post("/register", h.Register)
	r.Post("/login", h.Login)
	r.Post("/logout", h.Logout)
	return r
}

type authHandlers struct {
	userService    service.UserService
	sessionStore   *sessions.CookieStore
	sessionName    string
	sessionUserKey string
}

func (h *authHandlers) Register(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	err := h.userService.Register(request.Name, request.Email, request.Password)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrUserAlreadyExists) {
			status = http.StatusConflict
		}
		http.Error(w, err.Error(), status)
		return
	}
}

func (h *authHandlers) Login(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	session, _ := h.sessionStore.Get(r, h.sessionName)
	user, err := h.userService.Login(request.Email, request.Password)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrUserInvalidEmailOrPassword) {
			status = http.StatusUnauthorized
		}
		http.Error(w, err.Error(), status)
		return
	}
	session.Values[h.sessionUserKey] = user.ID
	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *authHandlers) Logout(w http.ResponseWriter, r *http.Request) {
	session, _ := h.sessionStore.Get(r, h.sessionName)
	session.Values = nil
	err := session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
