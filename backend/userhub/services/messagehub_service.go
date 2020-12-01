package services

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"html"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/digitalocean/godo"
	"github.com/twitchtv/twirp"
	yptr "github.com/vmware-labs/yaml-jsonpointer"
	"gopkg.in/yaml.v3"

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

	_, err = loadNodePublicKey(ctx, r.Address)
	if err != nil {
		return nil, twirp.NewError(twirp.InvalidArgument, err.Error())
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
	var hubAddress string
	hub, err := s.repos.MessageHubs.HubByID(r.HubId)
	if err != nil {
		if !merry.Is(err, repo.ErrHubNotFound) {
			return nil, err
		}
		hubAddress = common.CleanPublicURL(r.HubId)
	} else {
		hubAddress = hub.Address
	}

	_, err = loadNodePublicKey(ctx, hubAddress)
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

	hub, err := s.repos.MessageHubs.HubByID(r.HubId)
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
	hub, err := s.repos.MessageHubs.HubByID(r.HubId)
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
	hub, err := s.repos.MessageHubs.HubByID(r.HubId)
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

	hub, err := s.repos.MessageHubs.HubByIDOrAddress(r.HubId)
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

	err = s.mailSender.SendHTMLEmail([]string{hubAdmin.Email}, "Objectional Content Reported",
		fmt.Sprintf(`<p>User %s just reported objectionable content for user %s: %s<p>
<p>Please visit <a href="%s" target="_blank">the audit dashboard</a> to review the content.</p>`,
			reportedBy.Name, author.Name, html.EscapeString(body.Report), s.cfg.FrontendAddress+"/dashboard"))
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *messageHubService) BlockUser(ctx context.Context, r *rpc.MessageHubBlockUserRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	hub, err := s.repos.MessageHubs.HubByIDOrAddress(r.HubId)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	if hub.AdminID != user.ID {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	err = s.repos.MessageHubs.BlockUser(r.UserId, hub.ID)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *messageHubService) Create(ctx context.Context, r *rpc.MessageHubCreateRequest) (*rpc.Empty, error) {
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	if r.Owner == "" {
		return nil, twirp.InvalidArgumentError("owner", "is empty")
	}
	if r.Subdomain == "" {
		return nil, twirp.InvalidArgumentError("subdomain", "is empty")
	}

	owner, err := s.repos.User.FindUserByIDOrName(r.Owner)
	if err != nil {
		return nil, err
	}
	if owner == nil {
		return nil, twirp.InvalidArgumentError("owner", "is invalid")
	}

	if s.cfg.DigitalOceanToken == "" || s.cfg.ExternalAddress == "" || s.cfg.MessageHubConfig == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid operation")
	}

	externalDomain, err := common.GetEffectiveTLDPlusOne(s.cfg.ExternalAddress)
	if err != nil {
		return nil, merry.Prepend(err, "can't get GetEffectiveTLDPlusOne")
	}
	hubAddress := common.CleanPublicURL("https://" + r.Subdomain + "." + externalDomain)
	hubExists, err := s.repos.MessageHubs.HubExists(hubAddress)
	if err != nil {
		return nil, err
	}
	if hubExists {
		return nil, twirp.NewError(twirp.AlreadyExists, "hub already exists")
	}

	err = s.createDomainRecord(ctx, externalDomain, r.Subdomain)
	if err != nil {
		return nil, err
	}

	err = s.applyConfiguration(ctx, hubAddress, r.Subdomain)
	if err != nil {
		return nil, err
	}

	hubID, err := s.repos.MessageHubs.AddHub(hubAddress, r.Notes, *owner, 0)
	if err != nil {
		return nil, err
	}

	err = s.repos.MessageHubs.ApproveHub(hubID)
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) createDomainRecord(ctx context.Context, externalDomain, subdomain string) error {
	client := godo.NewFromToken(s.cfg.DigitalOceanToken)
	_, _, err := client.Domains.CreateRecord(ctx, externalDomain, &godo.DomainRecordEditRequest{
		Type: "CNAME",
		Name: subdomain,
		TTL:  1800,
	})
	if err != nil {
		return merry.Prepend(err, "can't create new domain record")
	}
	return nil
}

func (s *messageHubService) applyConfiguration(ctx context.Context, externalAddress, subdomain string) error {
	config, err := s.downloadConfiguration(ctx, externalAddress, subdomain)
	if err != nil {
		return merry.Wrap(err)
	}
	f, err := ioutil.TempFile("", "*.yaml")
	if err != nil {
		return merry.Prepend(err, "can't create temp file")
	}
	defer func() {
		_ = f.Close()
		_ = os.Remove(f.Name())
	}()

	_, err = f.Write(config)
	if err != nil {
		return merry.Prepend(err, "can't write to temp config file")
	}
	err = f.Close()
	if err != nil {
		return merry.Prepend(err, "can't close temp config file")
	}

	cmd := exec.Command("kubectl", "apply", "-f", f.Name())
	output, err := cmd.CombinedOutput()
	if err != nil {
		return merry.Prepend(err, string(output))
	}

	return nil
}

func (s *messageHubService) downloadConfiguration(ctx context.Context, externalAddress, subdomain string) ([]byte, error) {
	client := &http.Client{
		Timeout: time.Second * 20,
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, s.cfg.MessageHubConfig, nil)
	if err != nil {
		return nil, merry.Prepend(err, "can't create http request")
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, merry.Prepend(err, "can't do http request")
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode < 200 || 300 <= resp.StatusCode {
		return nil, merry.Errorf("unexpected status code: %s", resp.StatusCode)
	}

	var doc1, doc2 yaml.Node
	decoder := yaml.NewDecoder(resp.Body)
	err = decoder.Decode(&doc1)
	if err != nil {
		return nil, merry.Prepend(err, "can't decode yaml")
	}
	err = decoder.Decode(&doc2)
	if err != nil {
		return nil, merry.Prepend(err, "can't decode yaml")
	}

	err = s.modifyYAMLValue(&doc1, "/metadata/name", func(value string) string {
		return value + "-" + subdomain
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/selector/matchLabels/app", func(value string) string {
		return value + "-" + subdomain
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/template/metadata/labels/app", func(value string) string {
		return value + "-" + subdomain
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/template/spec/containers/0/name", func(value string) string {
		return value + "-" + subdomain
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/template/spec/containers/0/env/~{name: KOTO_EXTERNAL_ADDRESS}/value", func(value string) string {
		return externalAddress
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/template/spec/containers/0/env/~{name: KOTO_DB_NAME}/value", func(value string) string {
		return strings.ReplaceAll(value, "-message-hub-1", "-message-hub-"+subdomain)
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc1, "/spec/template/spec/containers/0/env/~{name: KOTO_S3_BUCKET}/value", func(value string) string {
		return strings.ReplaceAll(value, "-message-hub-1", "-message-hub-"+subdomain)
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc2, "/metadata/name", func(value string) string {
		return strings.ReplaceAll(value, "message-hub-", "message-hub-"+subdomain+"-")
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.modifyYAMLValue(&doc2, "/spec/selector/app", func(value string) string {
		return value + "-" + subdomain
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	var b bytes.Buffer
	b.WriteString("---\n")

	encoder := yaml.NewEncoder(&b)
	err = encoder.Encode(&doc1)
	if err != nil {
		return nil, merry.Prepend(err, "can't ecnode yaml")
	}
	err = encoder.Encode(&doc2)
	if err != nil {
		return nil, merry.Prepend(err, "can't ecnode yaml")
	}

	return b.Bytes(), nil
}

func (s *messageHubService) modifyYAMLValue(config *yaml.Node, path string, getNewValue func(value string) string) error {
	node, err := yptr.Find(config, path)
	if err != nil {
		return merry.Prepend(err, "can't find "+path)
	}
	node.Value = getNewValue(node.Value)
	return nil
}
