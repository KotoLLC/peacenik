package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Community(relationRepo repo.RelationRepo) http.Handler {
	h := &communityHandlers{
		relationRepo: relationRepo,
	}
	r := chi.NewRouter()
	r.Post("/invited", h.InvitedCommunities)
	r.Post("/related", h.RelatedCommunities)
	return r
}

type communityHandlers struct {
	relationRepo repo.RelationRepo
}

func (h *communityHandlers) InvitedCommunities(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	communities, err := h.relationRepo.InvitedCommunities(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if communities == nil {
		communities = []string{}
	}
	common.WriteJSONToResponse(w, communities)
}

func (h *communityHandlers) RelatedCommunities(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	communities, err := h.relationRepo.RelatedCommunities(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if communities == nil {
		communities = []repo.Community{}
	}
	common.WriteJSONToResponse(w, communities)
}
