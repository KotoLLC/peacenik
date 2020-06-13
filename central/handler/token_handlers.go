package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Token(tokenService service.TokenService) http.Handler {
	h := &tokenHandlers{
		tokenService: tokenService,
	}
	r := chi.NewRouter()
	r.Post("/auth", h.Auth)
	r.Post("/post", h.Post)
	return r
}

type tokenHandlers struct {
	tokenService service.TokenService
}

func (h *tokenHandlers) Auth(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)

	token, err := h.tokenService.Auth(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response struct {
		Token string `json:"token"`
	}
	response.Token = token
	common.WriteJSONToResponse(w, response)
}

func (h *tokenHandlers) Post(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)

	var request struct {
		Communities []string `json:"communities"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	tokens, err := h.tokenService.Post(user, request.Communities)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response struct {
		Tokens []string `json:"tokens"`
	}
	response.Tokens = tokens
	common.WriteJSONToResponse(w, response)
}
