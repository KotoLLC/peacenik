package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Invite(inviteService service.InviteService) http.Handler {
	h := &inviteHandlers{
		inviteService: inviteService,
	}
	r := chi.NewRouter()
	r.Post("/token", h.Token)
	return r
}

type inviteHandlers struct {
	inviteService service.InviteService
}

func (h *inviteHandlers) Token(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)

	var request struct {
		Whom string `json:"whom"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	if request.Whom == "" {
		http.Error(w, "", http.StatusBadRequest)
		return
	}

	token, err := h.inviteService.Token(user, request.Whom)
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
