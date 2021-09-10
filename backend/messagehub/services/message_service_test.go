package services_test

import (
	"context"
	"crypto/rsa"
	"testing"
	"time"

	"github.com/stretchr/testify/suite"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/messagehub/migrate"
	"github.com/mreider/koto/backend/messagehub/repo"
	"github.com/mreider/koto/backend/messagehub/rpc"
	"github.com/mreider/koto/backend/messagehub/services"
	"github.com/mreider/koto/backend/testutils"
	"github.com/mreider/koto/backend/token"
)

type MessageServiceTestSuite struct {
	suite.Suite
	te             *testutils.TestEnvironment
	repos          repo.Repos
	service        rpc.MessageService
	tokenGenerator token.Generator
}

func TestMessageServiceTestSuite(t *testing.T) {
	suite.Run(t, &MessageServiceTestSuite{})
}

func (s *MessageServiceTestSuite) SetupSuite() {
	rsaKey, err := common.GenerateRSAKey()
	s.Require().Nil(err)
	privateKey, publicKey, _, err := common.RSAKeysFromPrivateKeyContent(string(rsaKey))
	s.Require().Nil(err)
	s.tokenGenerator = token.NewGenerator(privateKey)
	tokenParser := token.NewParser(func() *rsa.PublicKey {
		return publicKey
	})

	s.te = testutils.NewTestEnvironment("token_service", migrate.Migrate)
	s.repos = repo.NewRepos(s.te.DB)
	base := services.NewBase(s.repos, tokenParser, s.tokenGenerator, "hub-1", "", s.te.Storage, nil)
	s.service = services.NewMessage(base)
}

func (s *MessageServiceTestSuite) SetupTest() {
	_, err := s.te.DB.Exec(`truncate table messages, message_likes, message_reports, message_visibility, message_reads;`)
	s.Require().Nil(err)
	_, err = s.te.DB.Exec(`truncate table users cascade;`)
	s.Require().Nil(err)
}

func (s *MessageServiceTestSuite) TearDownSuite() {
	s.te.Cleanup()
}

func (s *MessageServiceTestSuite) Test_Post() {
	ctx := s.userContext("user-1")
	resp, err := s.service.Post(ctx, &rpc.MessagePostRequest{
		Token: s.postToken("user-1"),
		Text:  "first message",
	})
	s.Nil(err)
	m := resp.Message
	s.NotEmpty(m.Id)
	s.Equal("user-1", m.UserId)
	s.Equal("first message", m.Text)
	s.Empty(m.Attachment)
	s.Empty(m.AttachmentType)
	s.Empty(m.AttachmentThumbnail)
	s.NotEmpty(m.CreatedAt)
	s.NotEmpty(m.UpdatedAt)
	s.Equal(int32(0), m.Likes)
	s.Equal(false, m.LikedByMe)
	s.Empty(m.Comments)
	s.Empty(m.LikedBy)

	resp, err = s.service.Post(ctx, &rpc.MessagePostRequest{
		Token: s.postGroupToken("user-1", "group-1"),
		Text:  "second message",
	})
	s.Nil(err)
	m = resp.Message
	s.NotEmpty(m.Id)
	s.Equal("user-1", m.UserId)
	s.Equal("second message", m.Text)
	s.Empty(m.Attachment)
	s.Empty(m.AttachmentType)
	s.Empty(m.AttachmentThumbnail)
	s.NotEmpty(m.CreatedAt)
	s.NotEmpty(m.UpdatedAt)
	s.Equal(int32(0), m.Likes)
	s.Equal(false, m.LikedByMe)
	s.Empty(m.Comments)
	s.Empty(m.LikedBy)

	mResp, err := s.service.Messages(ctx, &rpc.MessageMessagesRequest{
		Token: s.getToken("user-1", nil),
	})
	s.Nil(err)
	s.Equal(1, len(mResp.Messages))
	s.Equal("first message", mResp.Messages[0].Text)

	mResp, err = s.service.Messages(ctx, &rpc.MessageMessagesRequest{
		Token:   s.getToken("user-1", []string{"group-1"}),
		GroupId: "group-1",
	})
	s.Nil(err)
	s.Equal(1, len(mResp.Messages))
	s.Equal("second message", mResp.Messages[0].Text)
}

func (s *MessageServiceTestSuite) userContext(name string) context.Context {
	ctx := context.WithValue(context.Background(), services.ContextUserKey, services.User{
		ID:       name,
		Name:     name + "-name",
		FullName: name + " " + name,
	})
	return ctx
}

func (s *MessageServiceTestSuite) postToken(user string) string {
	t, err := s.tokenGenerator.Generate(user, "post-message", time.Now().Add(time.Second), map[string]interface{}{
		"hub": "hub-1",
	})
	s.Require().Nil(err)
	return t
}

func (s *MessageServiceTestSuite) postGroupToken(user, groupID string) string {
	t, err := s.tokenGenerator.Generate(user, "post-message", time.Now().Add(time.Second), map[string]interface{}{
		"hub":      "hub-1",
		"group_id": groupID,
	})
	s.Require().Nil(err)
	return t
}

func (s *MessageServiceTestSuite) getToken(user string, groups []string) string {
	claims := map[string]interface{}{
		"hub":   "hub-1",
		"users": []string{user},
	}
	if len(groups) > 0 {
		claims["groups"] = groups
	}
	t, err := s.tokenGenerator.Generate(user, "get-messages", time.Now().Add(time.Second), claims)
	s.Require().Nil(err)
	return t
}
