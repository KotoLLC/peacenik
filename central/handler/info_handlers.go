package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Info(infoService service.InfoService) http.Handler {
	h := &infoHandlers{
		infoService: infoService,
	}
	r := chi.NewRouter()
	r.Get("/publicKey", h.PublicKey)
	return r
}

type infoHandlers struct {
	infoService service.InfoService
}

func (h *infoHandlers) PublicKey(w http.ResponseWriter, _ *http.Request) {
	var response struct {
		PublicKey string `json:"public_key"`
	}
	response.PublicKey = h.infoService.PublicKey()
	common.WriteJSONToResponse(w, response)
}
