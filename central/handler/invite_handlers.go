package handler

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
	"github.com/mreider/koto/token"
)

func Invite(inviteService service.InviteService) http.Handler {
	h := &inviteHandlers{
		inviteService: inviteService,
	}
	r := chi.NewRouter()
	r.Post("/create", h.Create)
	r.Post("/accept", h.Accept)
	return r
}

type inviteHandlers struct {
	inviteService service.InviteService
}

func (h *inviteHandlers) Create(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)

	var request struct {
		Whom string `json:"whom"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	if request.Whom == "" || request.Whom == user.Email {
		http.Error(w, "", http.StatusBadRequest)
		return
	}

	inviteToken, err := h.inviteService.Create(user, request.Whom)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response struct {
		Token string `json:"token"`
	}
	response.Token = inviteToken
	common.WriteJSONToResponse(w, response)
}

func (h *inviteHandlers) Accept(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)

	var request struct {
		Token string `json:"token"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	if request.Token == "" {
		http.Error(w, "", http.StatusBadRequest)
		return
	}

	err := h.inviteService.Accept(user, request.Token)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, token.ErrInvalidToken) {
			status = http.StatusBadRequest
		}
		http.Error(w, err.Error(), status)
		return
	}
}
