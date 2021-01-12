package services_test

import (
	"context"
	"crypto/rsa"
	"testing"
	"time"

	"github.com/stretchr/testify/suite"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/testutils"
	"github.com/mreider/koto/backend/token"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/migrate"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services"
)

type TokenServiceTestSuite struct {
	suite.Suite
	te          *testutils.TestEnvironment
	repos       repo.Repos
	service     rpc.TokenService
	tokenParser token.Parser
}

func TestTokenServiceTestSuite(t *testing.T) {
	suite.Run(t, &TokenServiceTestSuite{})
}

func (s *TokenServiceTestSuite) SetupSuite() {
	rsaKey, err := common.GenerateRSAKey()
	s.Require().Nil(err)
	privateKey, publicKey, _, err := common.RSAKeysFromPrivateKeyContent(string(rsaKey))
	s.Require().Nil(err)
	tokenGenerator := token.NewGenerator(privateKey)
	s.tokenParser = token.NewParser(func() *rsa.PublicKey {
		return publicKey
	})

	s.te = testutils.NewTestEnvironment("token_service", migrate.Migrate)
	s.repos = repo.NewRepos(s.te.DB)
	base := services.NewBase(s.repos, s.te.Storage, nil, nil, nil, config.Config{}, nil)
	s.service = services.NewToken(base, tokenGenerator, time.Minute)
}

func (s *TokenServiceTestSuite) SetupTest() {
	_, err := s.te.DB.Exec(`truncate table group_users, group_invites, groups, friends;`)
	s.Require().Nil(err)
	_, err = s.te.DB.Exec(`truncate table users cascade;`)
	s.Require().Nil(err)
}

func (s *TokenServiceTestSuite) TearDownSuite() {
	s.te.Cleanup()
}

func (s *TokenServiceTestSuite) Test_Auth_SimpleUser() {
	now := time.Now()
	ctx := s.userContext("user-1")
	resp, err := s.service.Auth(ctx, &rpc.Empty{})
	s.Nil(err)
	_, claims, err := s.tokenParser.Parse(resp.Token, "auth1")
	s.EqualError(err, "invalid token")
	_, claims, err = s.tokenParser.Parse(resp.Token, "auth")
	s.Nil(err)
	s.Equal("auth", claims["scope"].(string))
	s.Equal("user-1", claims["id"].(string))
	s.Equal("user-1-name", claims["name"].(string))
	s.Equal("user-1 user-1", claims["full_name"].(string))
	s.Empty(claims["owned_hubs"].([]interface{}))
	s.Empty(claims["blocked_users"].([]interface{}))
	s.True(claims["exp"].(float64) > float64(now.Unix()))
	s.True(claims["exp"].(float64) < float64(now.Add(time.Second*63).Unix()))
}

func (s *TokenServiceTestSuite) Test_Auth_HubOwner() {
	s.addUser("user-1")
	s.addUser("user-2")
	s.addHub("hub-1", "user-1")
	s.addHub("hub-2", "user-2")

	now := time.Now()
	ctx := s.userContext("user-1")
	resp, err := s.service.Auth(ctx, &rpc.Empty{})
	s.Nil(err)
	_, claims, err := s.tokenParser.Parse(resp.Token, "auth1")
	s.EqualError(err, "invalid token")
	_, claims, err = s.tokenParser.Parse(resp.Token, "auth")
	s.Nil(err)
	s.Equal("auth", claims["scope"].(string))
	s.Equal("user-1", claims["id"].(string))
	s.Equal("user-1-name", claims["name"].(string))
	s.Equal("user-1 user-1", claims["full_name"].(string))
	s.Equal([]interface{}{"hub-1"}, claims["owned_hubs"].([]interface{}))
	s.Empty(claims["blocked_users"].([]interface{}))
	s.True(claims["exp"].(float64) > float64(now.Unix()))
	s.True(claims["exp"].(float64) < float64(now.Add(time.Second*63).Unix()))
}

func (s *TokenServiceTestSuite) Test_PostMessage_NoGroups_NoHubs() {
	ctx := s.userContext("user-1")
	resp, err := s.service.PostMessage(ctx, &rpc.TokenPostMessageRequest{})
	s.Nil(err)
	s.Empty(resp.Tokens)
}

func (s *TokenServiceTestSuite) Test_PostMessage_WithoutGroup() {
	now := time.Now()
	s.addUser("user-1")
	s.addUser("user-2")
	s.addHub("hub-1", "user-2")
	s.addFriends("user-1", "user-2")
	s.addPublicGroup("group-1", "user-1")
	s.addGroupUser("group-1", "user-2")

	ctx := s.userContext("user-1")
	resp, err := s.service.PostMessage(ctx, &rpc.TokenPostMessageRequest{})
	s.Nil(err)
	s.Equal(1, len(resp.Tokens))
	_, claims, err := s.tokenParser.Parse(resp.Tokens["hub-1"], "post-message")
	s.Nil(err)
	s.Equal("post-message", claims["scope"].(string))
	s.Equal("hub-1", claims["hub"].(string))
	s.Equal("user-1", claims["id"].(string))
	s.Equal("user-1-name", claims["name"].(string))
	s.Equal([]interface{}{"user-2"}, claims["friends"].([]interface{}))
	s.True(claims["exp"].(float64) > float64(now.Unix()))
	s.True(claims["exp"].(float64) < float64(now.Add(time.Second*63).Unix()))

	_, ok := claims["groups"]
	s.False(ok)
}

func (s *TokenServiceTestSuite) Test_PostMessage_Group() {
	now := time.Now()
	s.addUser("user-1")
	s.addUser("user-2")
	s.addHub("hub-1", "user-1")
	s.addFriends("user-1", "user-2")
	s.addPublicGroup("group-1", "user-1")
	s.addGroupUser("group-1", "user-2")

	ctx := s.userContext("user-1")
	resp, err := s.service.PostMessage(ctx, &rpc.TokenPostMessageRequest{GroupId: "group-1"})
	s.Nil(err)
	s.Equal(1, len(resp.Tokens))
	_, claims, err := s.tokenParser.Parse(resp.Tokens["hub-1"], "post-message")
	s.Nil(err)
	s.Equal("post-message", claims["scope"].(string))
	s.Equal("hub-1", claims["hub"].(string))
	s.Equal("user-1", claims["id"].(string))
	s.Equal("user-1-name", claims["name"].(string))
	s.Equal("group-1", claims["group_id"].(string))
	s.True(claims["exp"].(float64) > float64(now.Unix()))
	s.True(claims["exp"].(float64) < float64(now.Add(time.Second*63).Unix()))

	_, ok := claims["friends"]
	s.False(ok)
}

func (s *TokenServiceTestSuite) Test_PostMessage_Group_NotHubAdmin() {
	s.addUser("user-1")
	s.addUser("user-2")
	s.addHub("hub-1", "user-2")
	s.addFriends("user-1", "user-2")
	s.addPublicGroup("group-1", "user-1")
	s.addGroupUser("group-1", "user-2")

	ctx := s.userContext("user-1")
	resp, err := s.service.PostMessage(ctx, &rpc.TokenPostMessageRequest{GroupId: "group-1"})
	s.Nil(err)
	s.Equal(0, len(resp.Tokens))
}

func (s *TokenServiceTestSuite) Test_GetMessages() {
	now := time.Now()
	s.addUser("user-1")
	s.addUser("user-2")
	s.addHub("hub-1", "user-1")
	s.addFriends("user-1", "user-2")
	s.addPublicGroup("group-1", "user-1")
	s.addGroupUser("group-1", "user-2")

	ctx := s.userContext("user-1")
	resp, err := s.service.GetMessages(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(resp.Tokens))
	_, claims, err := s.tokenParser.Parse(resp.Tokens["hub-1"], "get-messages")
	s.Nil(err)
	s.Equal("get-messages", claims["scope"].(string))
	s.Equal("hub-1", claims["hub"].(string))
	s.Equal("user-1", claims["id"].(string))
	s.Equal("user-1-name", claims["name"].(string))
	s.Equal([]interface{}{"group-1"}, claims["groups"].([]interface{}))
	s.True(claims["exp"].(float64) > float64(now.Unix()))
	s.True(claims["exp"].(float64) < float64(now.Add(time.Second*63).Unix()))

	_, ok := claims["friends"]
	s.False(ok)
}

func (s *TokenServiceTestSuite) userContext(name string) context.Context {
	ctx := context.WithValue(context.Background(), services.ContextUserKey, repo.User{
		ID:       name,
		Name:     name + "-name",
		FullName: name + " " + name,
	})
	return context.WithValue(ctx, services.ContextIsAdminKey, false)
}

func (s *TokenServiceTestSuite) addUser(name string) {
	s.repos.User.AddUser(name, name+"-name", name+"@mail.org", name+" "+name, "")
}

func (s *TokenServiceTestSuite) addPublicGroup(id, adminName string) {
	s.repos.Group.AddGroup(id, id+"-name", id+" description", adminName, true)
}

func (s *TokenServiceTestSuite) addGroupUser(groupID, userID string) {
	s.repos.Group.AddUserToGroup(groupID, userID)
}

func (s *TokenServiceTestSuite) addHub(address, adminID string) string {
	hubID := s.repos.MessageHubs.AddHub(address, "", adminID, 0, false)
	s.repos.MessageHubs.ApproveHub(hubID)
	return hubID
}

func (s *TokenServiceTestSuite) addFriends(user1, user2 string) {
	_, err := s.te.DB.Exec(`
		insert into friends(user_id, friend_id)
		values ($1, $2), ($2, $1);`,
		user1, user2)
	if err != nil {
		panic(err)
	}
}
