package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

type messageHubService struct {
	*BaseService
	admins []string
}

func NewMessageHub(base *BaseService, admins []string) rpc.MessageHubService {
	return &messageHubService{
		BaseService: base,
		admins:      admins,
	}
}

func (s *messageHubService) Register(ctx context.Context, r *rpc.MessageHubRegisterRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	r.Address = common.CleanPublicURL(r.Address)
	hubExists, err := s.repos.MessageHubs.HubExists(r.Address)
	if err != nil {
		return nil, err
	}
	if hubExists {
		return nil, twirp.NewError(twirp.AlreadyExists, "hub already exists")
	}
	hubID, err := s.repos.MessageHubs.AddHub(r.Address, r.Details, user, int(r.PostLimit))
	if err != nil {
		return nil, err
	}

	for _, admin := range s.admins {
		adminUser, err := s.repos.User.FindUserByName(admin)
		if err != nil && !merry.Is(err, sql.ErrNoRows) {
			log.Println(err)
		}
		if adminUser != nil {
			s.notificationSender.SendNotification([]string{adminUser.ID}, user.Name+" added a new message hub", "message-hub/add", map[string]interface{}{
				"user_id": user.ID,
				"hub_id":  hubID,
			})
		}
	}
	return &rpc.Empty{}, nil
}

func (s *messageHubService) Hubs(ctx context.Context, _ *rpc.Empty) (*rpc.MessageHubHubsResponse, error) {
	user := s.getUser(ctx)

	var hubs []repo.MessageHub
	var err error
	if s.isAdmin(ctx) {
		hubs, err = s.repos.MessageHubs.AllHubs()
	} else {
		hubs, err = s.repos.MessageHubs.Hubs(user)
	}
	if err != nil {
		return nil, err
	}

	rpcHubs := make([]*rpc.MessageHubHubsResponseHub, len(hubs))
	for i, hub := range hubs {
		rpcHubs[i] = &rpc.MessageHubHubsResponseHub{
			Id:      hub.ID,
			Address: hub.Address,
			User: &rpc.User{
				Id:   hub.AdminID,
				Name: hub.AdminName,
			},
			CreatedAt:  common.TimeToRPCString(hub.CreatedAt),
			ApprovedAt: common.NullTimeToRPCString(hub.ApprovedAt),
			DisabledAt: common.NullTimeToRPCString(hub.DisabledAt),
			Details:    hub.Details,
			PostLimit:  int32(hub.PostLimit),
		}
	}

	return &rpc.MessageHubHubsResponse{
		Hubs: rpcHubs,
	}, nil
}

func (s *messageHubService) Verify(ctx context.Context, r *rpc.MessageHubVerifyRequest) (*rpc.MessageHubVerifyResponse, error) {
	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		return nil, err
	}
	_, err = loadNodePublicKey(ctx, hub.Address)
	if err != nil {
		return &rpc.MessageHubVerifyResponse{
			Error: err.Error(),
		}, nil
	}
	return &rpc.MessageHubVerifyResponse{}, nil
}

func (s *messageHubService) Approve(ctx context.Context, r *rpc.MessageHubApproveRequest) (*rpc.MessageHubApproveResponse, error) {
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	user := s.getUser(ctx)

	resp, err := s.Verify(ctx, &rpc.MessageHubVerifyRequest{HubId: r.HubId})
	if err != nil {
		return nil, err
	}
	if resp.Error != "" {
		return &rpc.MessageHubApproveResponse{
			Error: resp.Error,
		}, nil
	}

	err = s.repos.MessageHubs.ApproveHub(r.HubId)
	if err != nil {
		return nil, err
	}

	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		return nil, err
	}

	s.notificationSender.SendNotification([]string{hub.AdminID}, user.Name+" approved your message hub", "message-hub/approve", map[string]interface{}{
		"user_id": user.ID,
		"hub_id":  r.HubId,
	})
	return &rpc.MessageHubApproveResponse{}, nil
}

func (s *messageHubService) Remove(ctx context.Context, r *rpc.MessageHubRemoveRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	if !s.isAdmin(ctx) && hub.AdminID != user.ID {
		return nil, twirp.NotFoundError(repo.ErrHubNotFound.Error())
	}

	err = s.repos.MessageHubs.RemoveHub(r.HubId)
	if err != nil {
		return nil, err
	}

	if hub.AdminID != user.ID {
		s.notificationSender.SendNotification([]string{hub.AdminID}, user.Name+" removed your message hub", "message-hub/remove", map[string]interface{}{
			"user_id": user.ID,
			"hub_id":  r.HubId,
		})
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) SetPostLimit(ctx context.Context, r *rpc.MessageHubSetPostLimitRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	if hub.AdminID != user.ID {
		return nil, twirp.NotFoundError(repo.ErrHubNotFound.Error())
	}

	err = s.repos.MessageHubs.SetHubPostLimit(user.ID, r.HubId, int(r.PostLimit))
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) ReportMessage(ctx context.Context, r *rpc.MessageHubReportMessageRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	hub, err := s.repos.MessageHubs.Hub(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	hubAdmin, err := s.repos.User.FindUserByID(hub.AdminID)
	if err != nil {
		return nil, err
	}
	if hubAdmin == nil {
		return nil, twirp.NotFoundError("hub admin not found")
	}

	claims := map[string]interface{}{
		"owned_hubs": []string{hub.Address},
	}
	authToken, err := s.tokenGenerator.Generate(hubAdmin.ID, hubAdmin.Name, "auth", time.Now().Add(time.Second*30), claims)
	if err != nil {
		return nil, err
	}

	messageReportEndpoint := strings.TrimSuffix(hub.Address, "/") + "/rpc.MessageService/MessageReport"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, messageReportEndpoint,
		strings.NewReader(fmt.Sprintf(`{"report_id": "%s"}`, r.ReportId)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+authToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return nil, merry.New("unexpected status code: " + resp.Status)
	}
	var body struct {
		ReportedBy     string `json:"reported_by"`
		AuthorID       string `json:"author_id"`
		Report         string `json:"report"`
		Text           string `json:"text"`
		AttachmentLink string `json:"attachment_link"`
	}
	err = json.NewDecoder(resp.Body).Decode(&body)
	if err != nil {
		return nil, err
	}

	reportedBy, err := s.repos.User.FindUserByID(body.ReportedBy)
	if err != nil {
		return nil, err
	}
	if reportedBy == nil {
		return nil, twirp.NotFoundError("reported user not found")
	}

	if user.ID != reportedBy.ID {
		return nil, twirp.InvalidArgumentError("user", "not valid")
	}

	author, err := s.repos.User.FindUserByID(body.AuthorID)
	if err != nil {
		return nil, err
	}
	if author == nil {
		return nil, twirp.NotFoundError("message author not found")
	}

	err = s.mailSender.SendTextEmail([]string{hubAdmin.Email}, "Objectional Content Reported",
		fmt.Sprintf(`User %s just reported objectionable content for user %s: %s.
Please visit the audit dashboard to review the content.`, reportedBy.Name, author.Name, body.Report))
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}
