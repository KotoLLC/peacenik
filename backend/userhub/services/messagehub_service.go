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
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
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
			s.notificationSender.SendNotification([]string{adminUser.ID}, user.DisplayName()+" added a new message hub", "message-hub/add", map[string]interface{}{
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
				Id:       hub.AdminID,
				Name:     hub.AdminName,
				FullName: hub.AdminFullName,
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

	s.notificationSender.SendNotification([]string{hub.AdminID}, user.DisplayName()+" approved your message hub", "message-hub/approve", map[string]interface{}{
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
		s.notificationSender.SendNotification([]string{hub.AdminID}, user.DisplayName()+" removed your message hub", "message-hub/remove", map[string]interface{}{
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
			reportedBy.DisplayName(), author.DisplayName(), html.EscapeString(body.Report), s.cfg.FrontendAddress+"/dashboard"))
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
	r.Subdomain = strings.ToLower(r.Subdomain)

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

	err = s.applyConfiguration(ctx, r.Subdomain)
	if err != nil {
		return nil, err
	}

	err = s.createS3Bucket(r.Subdomain)
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

func (s *messageHubService) applyConfiguration(ctx context.Context, subdomain string) error {
	config, err := s.downloadConfiguration(ctx)
	if err != nil {
		return merry.Wrap(err)
	}
	config = bytes.ReplaceAll(config, []byte("<NAME>"), []byte(subdomain))

	cmd := exec.Command("/bin/sh", "-c",
		"doctl auth init -t $KOTO_DIGITALOCEAN_TOKEN; doctl k8s cluster config show b68876cd-8a1d-4073-bb00-0ac36beacc0c > /root/config")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return merry.Prepend(err, string(output))
	}

	cmd = exec.Command("kubectl", "apply", "--kubeconfig=/root/config", "-f", "-")
	cmd.Stdin = bytes.NewReader(config)
	output, err = cmd.CombinedOutput()
	if err != nil {
		return merry.Prepend(err, string(output))
	}

	return nil
}

func (s *messageHubService) downloadConfiguration(ctx context.Context) ([]byte, error) {
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
		return nil, merry.Errorf("unexpected status code: %s", resp.Status)
	}

	content, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, merry.Prepend(err, "can't read response body")
	}
	return content, nil
}

func (s *messageHubService) createS3Bucket(subdomain string) error {
	key := os.Getenv("KOTO_S3_KEY")
	secret := os.Getenv("KOTO_S3_SECRET")
	endpoint := os.Getenv("KOTO_S3_ENDPOINT")
	bucketName := "koto-message-hub-" + subdomain + "-staging"

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(key, secret, ""),
		Endpoint:    aws.String(endpoint),
		Region:      aws.String("us-east-1"),
	}

	newSession, err := session.NewSession(s3Config)
	if err != nil {
		return merry.Prepend(err, "can't create S3 session")
	}
	client := s3.New(newSession)

	createBucketParams := &s3.CreateBucketInput{
		Bucket: aws.String(bucketName),
	}
	_, err = client.CreateBucket(createBucketParams)
	if err != nil {
		return merry.Prepend(err, "can't create S3 bucket")
	}

	rule := s3.CORSRule{
		AllowedHeaders: aws.StringSlice([]string{"*"}),                                    // TODO
		AllowedOrigins: aws.StringSlice([]string{"https://orbits.at", "https://koto.at"}), // TODO
		MaxAgeSeconds:  aws.Int64(3000),
		AllowedMethods: aws.StringSlice([]string{http.MethodPost, http.MethodGet}),
	}

	putCORSParams := s3.PutBucketCorsInput{
		Bucket: aws.String(bucketName),
		CORSConfiguration: &s3.CORSConfiguration{
			CORSRules: []*s3.CORSRule{&rule},
		},
	}

	_, err = client.PutBucketCors(&putCORSParams)
	if err != nil {
		return merry.Prepend(err, "can't create S3 CORS rules")
	}
	return nil
}
