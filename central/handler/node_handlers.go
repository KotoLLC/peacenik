package handler

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/service"
	"github.com/mreider/koto/common"
)

func Node(nodeService service.NodeService, nodeRepo repo.NodeRepo) http.Handler {
	h := &nodeHandlers{
		nodeService: nodeService,
		nodeRepo:    nodeRepo,
	}
	r := chi.NewRouter()
	r.Post("/register", h.RegisterNode)
	r.Post("/postMessages", h.PostMessagesNodes)
	r.Post("/getMessages", h.GetMessagesNodes)
	return r
}

type nodeHandlers struct {
	nodeService service.NodeService
	nodeRepo    repo.NodeRepo
}

func (h *nodeHandlers) RegisterNode(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	var request struct {
		Address string `json:"address"`
	}
	if !common.ReadJSONFromRequest(w, r, &request) {
		return
	}

	err := h.nodeService.AddNode(request.Address, user.Email)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, service.ErrNodeAlreadyExists) {
			status = http.StatusConflict
		}
		http.Error(w, err.Error(), status)
		return
	}
}

func (h *nodeHandlers) PostMessagesNodes(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	nodeAddresses, err := h.nodeRepo.PostMessagesNodes(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if nodeAddresses == nil {
		nodeAddresses = []string{}
	}
	common.WriteJSONToResponse(w, nodeAddresses)
}

func (h *nodeHandlers) GetMessagesNodes(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(service.ContextUserKey).(repo.User)
	nodes, err := h.nodeRepo.GetMessageNodes(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if nodes == nil {
		nodes = []repo.GetMessagesNode{}
	}
	common.WriteJSONToResponse(w, nodes)
}
