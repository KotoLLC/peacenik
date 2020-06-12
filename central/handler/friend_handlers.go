package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Friend(relationRepo repo.RelationRepo) http.Handler {
	h := &friendHandlers{
		relationRepo: relationRepo,
	}
	r := chi.NewRouter()
	r.Post("/", h.Friends)
	return r
}

type friendHandlers struct {
	relationRepo repo.RelationRepo
}

func (h *friendHandlers) Friends(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	friends, err := h.relationRepo.Friends(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if friends == nil {
		friends = []repo.User{}
	}
	common.WriteJSONToResponse(w, friends)
}
