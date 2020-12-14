package services

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"html"
	"io"
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

func (s *messageHubService) Remove(ctx context.Context, r *rpc.MessageHubRemoveRequest) (*rpc.MessageHubRemoveResponse, error) {
	var messages []string
	var err error
	switch {
	case r.HubId != "":
		err = s.removeHubByID(ctx, r.HubId)
	case r.Subdomain != "":
		messages, err = s.removeHubBySubdomain(ctx, r.Subdomain)
	default:
		err = twirp.NewError(twirp.InvalidArgument, "hub_id should be specified")
	}

	if err != nil {
		return nil, err
	}
	return &rpc.MessageHubRemoveResponse{
		Messages: messages,
	}, nil
}

func (s *messageHubService) removeHubByID(ctx context.Context, hubID string) error {
	user := s.getUser(ctx)
	hub, err := s.repos.MessageHubs.HubByID(hubID)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return twirp.NotFoundError(err.Error())
		}
		return err
	}

	if !s.isAdmin(ctx) && hub.AdminID != user.ID {
		return twirp.NotFoundError(repo.ErrHubNotFound.Error())
	}

	err = s.repos.MessageHubs.RemoveHub(hubID)
	if err != nil {
		return err
	}

	if hub.AdminID != user.ID {
		s.notificationSender.SendNotification([]string{hub.AdminID}, user.DisplayName()+" removed your message hub", "message-hub/remove", map[string]interface{}{
			"user_id": user.ID,
			"hub_id":  hubID,
		})
	}

	return nil
}

func (s *messageHubService) removeHubBySubdomain(ctx context.Context, subdomain string) (messages []string, err error) {
	user := s.getUser(ctx)
	if !s.isAdmin(ctx) {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	cfg, err := s.getMessageHubConfig(ctx, subdomain, s.cfg.ExternalAddress)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	hub, err := s.repos.MessageHubs.HubByIDOrAddress(cfg.HubExternalAddress)
	if err != nil {
		if merry.Is(err, repo.ErrHubNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	err = s.repos.MessageHubs.RemoveHub(hub.ID)
	if err != nil {
		return nil, err
	}

	err = s.deleteMessageHubConfiguration(cfg)
	if err != nil {
		messages = append(messages, "can't delete hub: "+err.Error())
	}

	err = s.destroyMessageHubData(ctx, user, hub.Address)
	if err != nil {
		messages = append(messages, "can't send request to destroy hub data: "+err.Error())
	}

	if hub.AdminID != user.ID {
		s.notificationSender.SendNotification([]string{hub.AdminID}, user.DisplayName()+" removed your message hub", "message-hub/remove", map[string]interface{}{
			"user_id": user.ID,
			"hub_id":  hub.ID,
		})
	}

	return messages, nil
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
			reportedBy.DisplayName(), author.DisplayName(), html.EscapeString(body.Report), s.cfg.FrontendAddress+"/dashboard"), nil)
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

type messageHubConfig struct {
	Cfg                []byte
	HubExternalAddress string
	BucketName         string
	Namespace          string
	DeploymentName     string
	ServiceName        string
	IngressName        string
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

	config, err := s.getMessageHubConfig(ctx, r.Subdomain, s.cfg.ExternalAddress)
	if err != nil {
		return nil, err
	}

	hubExists, err := s.repos.MessageHubs.HubExists(config.HubExternalAddress)
	if err != nil {
		return nil, err
	}
	if hubExists {
		return nil, twirp.NewError(twirp.AlreadyExists, "hub already exists")
	}

	err = s.applyMessageHubConfiguration(config.Cfg)
	if err != nil {
		return nil, err
	}

	err = s.createS3Bucket(config.BucketName)
	if err != nil {
		return nil, err
	}

	hubID, err := s.repos.MessageHubs.AddHub(config.HubExternalAddress, r.Notes, *owner, 0)
	if err != nil {
		return nil, err
	}

	err = s.repos.MessageHubs.ApproveHub(hubID)
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *messageHubService) getMessageHubConfig(ctx context.Context, subdomain, userHubAddress string) (*messageHubConfig, error) {
	configContent, err := s.downloadMessageHubConfiguration(ctx)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	config, err := s.fixNodeConfiguration(configContent, subdomain, userHubAddress)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	return config, nil
}

func (s *messageHubService) applyMessageHubConfiguration(config []byte) error {
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

func (s *messageHubService) downloadMessageHubConfiguration(ctx context.Context) ([]byte, error) {
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

func (s *messageHubService) createS3Bucket(bucketName string) error {
	key := os.Getenv("KOTO_S3_KEY")
	secret := os.Getenv("KOTO_S3_SECRET")
	endpoint := os.Getenv("KOTO_S3_ENDPOINT")

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(key, secret, ""),
		Endpoint:    aws.String(endpoint),
		Region:      aws.String("us-east-1"), // https://github.com/aws/aws-sdk-go/issues/2232
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

func (s *messageHubService) fixNodeConfiguration(config []byte, subdomain, userHubAddress string) (*messageHubConfig, error) {
	config = bytes.ReplaceAll(config, []byte("<NAME>"), []byte(subdomain))

	docs := make([]yaml.Node, 0, 4)
	decoder := yaml.NewDecoder(bytes.NewReader(config))
	for {
		var doc yaml.Node
		err := decoder.Decode(&doc)
		if err != nil {
			if merry.Is(err, io.EOF) {
				break
			}
			return nil, merry.Prepend(err, "can't decode yaml")
		}
		docs = append(docs, doc)
	}

	externalAddressPath := "/spec/template/spec/containers/0/env/~{name: KOTO_EXTERNAL_ADDRESS}/value"
	externalAddressNode, err := yptr.Find(&docs[1], externalAddressPath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+externalAddressPath)
	}
	hubAddress := externalAddressNode.Value

	bucketNamePath := "/spec/template/spec/containers/0/env/~{name: KOTO_S3_BUCKET}/value"
	bucketNameNode, err := yptr.Find(&docs[1], bucketNamePath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+bucketNamePath)
	}
	bucketName := bucketNameNode.Value

	namePath := "/metadata/name"

	namespaceNode, err := yptr.Find(&docs[0], namePath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+namePath)
	}
	namespace := namespaceNode.Value

	deploymentNameNode, err := yptr.Find(&docs[1], namePath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+namePath)
	}
	deploymentName := deploymentNameNode.Value

	serviceNameNode, err := yptr.Find(&docs[2], namePath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+namePath)
	}
	serviceName := serviceNameNode.Value

	ingressNameNode, err := yptr.Find(&docs[3], namePath)
	if err != nil {
		return nil, merry.Prepend(err, "can't find "+namePath)
	}
	ingressName := ingressNameNode.Value

	err = s.modifyYAMLValue(&docs[1], "/spec/template/spec/containers/0/env/~{name: KOTO_USER_HUB_ADDRESS}/value", func(value string) string {
		return userHubAddress
	})
	if err != nil {
		return nil, merry.Wrap(err)
	}

	var b bytes.Buffer
	b.WriteString("---\n")

	encoder := yaml.NewEncoder(&b)
	for _, doc := range docs {
		err := encoder.Encode(&doc)
		if err != nil {
			return nil, merry.Prepend(err, "can't ecnode yaml")
		}
	}
	return &messageHubConfig{
		Cfg:                b.Bytes(),
		HubExternalAddress: hubAddress,
		BucketName:         bucketName,
		Namespace:          namespace,
		DeploymentName:     deploymentName,
		ServiceName:        serviceName,
		IngressName:        ingressName,
	}, nil
}

func (s *messageHubService) modifyYAMLValue(config *yaml.Node, path string, getNewValue func(value string) string) error {
	node, err := yptr.Find(config, path)
	if err != nil {
		return merry.Prepend(err, "can't find "+path)
	}
	node.Value = getNewValue(node.Value)
	return nil
}

func (s *messageHubService) destroyMessageHubData(ctx context.Context, user repo.User, messageHubAddress string) error {
	claims := map[string]interface{}{
		"owned_hubs": []string{messageHubAddress},
	}
	authToken, err := s.tokenGenerator.Generate(user.ID, user.Name, "auth", time.Now().Add(time.Second*30), claims)
	if err != nil {
		return err
	}

	client := &http.Client{
		Timeout: time.Second * 30,
	}
	r, err := http.NewRequestWithContext(ctx, http.MethodPost,
		fmt.Sprintf("%s/rpc.AdminService/DestroyData", strings.TrimSuffix(messageHubAddress, "/")),
		strings.NewReader("{}"))
	if err != nil {
		return merry.Wrap(err)
	}
	r.Header.Set("Authorization", "Bearer "+authToken)
	r.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(r)
	if err != nil {
		return merry.Wrap(err)
	}
	defer func() { _ = resp.Body.Close() }()
	return nil
}

func (s *messageHubService) deleteMessageHubConfiguration(cfg *messageHubConfig) error {
	cmd := exec.Command("/bin/sh", "-c",
		fmt.Sprintf("kubectl delete deployment %s -n %s; kubectl delete ingress %s -n %s; kubectl delete service %s -n %s",
			cfg.DeploymentName, cfg.Namespace, cfg.IngressName, cfg.Namespace, cfg.ServiceName, cfg.Namespace))
	output, err := cmd.CombinedOutput()
	if err != nil {
		return merry.Prepend(err, string(output))
	}
	return nil
}
