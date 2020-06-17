package handler

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/node/repo"
	"github.com/mreider/koto/backend/node/service"
	"github.com/mreider/koto/backend/token"
)

func Message(externalAddress string, tokenParser token.Parser, messageRepo repo.MessageRepo) http.Handler {
	h := &messageHandlers{
		externalAddress: externalAddress,
		tokenParser:     tokenParser,
		messageRepo:     messageRepo,
	}
	r := chi.NewRouter()
	r.Post("/get", h.Messages)
	r.Post("/post", h.PostMessage)
	return r
}

type messageHandlers struct {
	externalAddress string
	tokenParser     token.Parser
	messageRepo     repo.MessageRepo
}

func (h *messageHandlers) Messages(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(service.ContextUserKey).(string)

	var request struct {
		Token string `json:"token"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	_, claims, err := h.tokenParser.Parse(request.Token, "get-messages")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userID != claims["id"].(string) || h.externalAddress != claims["node"].(string) {
		http.Error(w, token.ErrInvalidToken.Error(), http.StatusBadRequest)
		return
	}

	rawUserIDs := claims["users"].([]interface{})
	userIDs := make([]string, len(rawUserIDs))
	for i, rawUserID := range rawUserIDs {
		userIDs[i] = rawUserID.(string)
	}
	messages, err := h.messageRepo.Messages(userIDs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var response struct {
		Messages []repo.Message `json:"messages"`
	}
	response.Messages = messages
	common.WriteJSONToResponse(w, response)
}

func (h *messageHandlers) PostMessage(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(service.ContextUserKey).(string)

	var request struct {
		Token   string       `json:"token"`
		Message repo.Message `json:"message"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	_, claims, err := h.tokenParser.Parse(request.Token, "post-message")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if userID != claims["id"].(string) || h.externalAddress != claims["node"].(string) {
		http.Error(w, token.ErrInvalidToken.Error(), http.StatusBadRequest)
		return
	}

	request.Message.UserID = claims["id"].(string)
	request.Message.UserName = claims["name"].(string)
	err = h.messageRepo.AddMessage(request.Message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
