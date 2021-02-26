package services_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/mreider/koto/backend/testutils"
	"github.com/mreider/koto/backend/userhub/bcrypt"
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/migrate"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services"
)

type UserServiceTestSuite struct {
	suite.Suite
	te            *testutils.TestEnvironment
	repos         repo.Repos
	passwordHash  services.PasswordHash
	userService   rpc.UserService
	inviteService rpc.InviteService
}

func TestUserServiceTestSuite(t *testing.T) {
	suite.Run(t, &UserServiceTestSuite{})
}

func (s *UserServiceTestSuite) SetupSuite() {
	s.te = testutils.NewTestEnvironment("user_service", migrate.Migrate)
	s.repos = repo.NewRepos(s.te.DB)
	userCache := caches.NewUsers(s.te.DB)
	base := services.NewBase(s.repos, services.BaseServiceOptions{
		UserCache: userCache,
		S3Storage: s.te.Storage,
	})
	s.passwordHash = bcrypt.NewPasswordHash()
	s.userService = services.NewUser(base, s.passwordHash)
	s.inviteService = services.NewInvite(base)
}

func (s *UserServiceTestSuite) SetupTest() {
	_, err := s.te.DB.Exec(`truncate table invites, friends;`)
	s.Require().Nil(err)
	_, err = s.te.DB.Exec(`truncate table users cascade;`)
	s.Require().Nil(err)
}

func (s *UserServiceTestSuite) TearDownSuite() {
	s.te.Cleanup()
}

func (s *UserServiceTestSuite) Test_Me() {
	s.addUser("user-1")

	ctx := s.userContext("user-1")
	resp, err := s.userService.Me(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal("user-1", resp.User.Id)
	s.Equal("user-1-name", resp.User.Name)
	s.Equal("user-1@mail.org", resp.User.Email)
	s.Equal("user-1 user-1", resp.User.FullName)
	s.Equal(false, resp.User.IsConfirmed)
	s.Equal(false, resp.User.HideIdentity)
	s.Equal(false, resp.IsAdmin)
	s.Empty(resp.OwnedHubs)
	s.Empty(resp.Groups)
}

func (s *UserServiceTestSuite) Test_Invite_Accept() {
	s.addUser("user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-1")
	respUser, err := s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("", respUser.InviteStatus)

	_, err = s.inviteService.Create(ctx, &rpc.InviteCreateRequest{
		Friend: "user-2",
	})
	s.Nil(err)

	respFromMe, err := s.inviteService.FromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromMe.Invites))
	s.Equal("user-2", respFromMe.Invites[0].FriendId)
	s.Equal("user-2-name", respFromMe.Invites[0].FriendName)
	s.Equal("user-2 user-2", respFromMe.Invites[0].FriendFullName)
	s.NotEmpty(respFromMe.Invites[0].CreatedAt)
	s.Empty(respFromMe.Invites[0].AcceptedAt)
	s.Empty(respFromMe.Invites[0].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err := s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	ctx = s.userContext("user-2")
	respForMe, err := s.inviteService.ForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForMe.Invites))
	s.Equal("user-1", respForMe.Invites[0].FriendId)
	s.Equal("user-1-name", respForMe.Invites[0].FriendName)
	s.Equal("user-1 user-1", respForMe.Invites[0].FriendFullName)
	s.NotEmpty(respForMe.Invites[0].CreatedAt)
	s.Empty(respForMe.Invites[0].AcceptedAt)
	s.Empty(respForMe.Invites[0].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	_, err = s.inviteService.Accept(ctx, &rpc.InviteAcceptRequest{
		InviterId: "user-1",
	})
	s.Nil(err)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("accepted", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFriends.Friends))
	s.Equal("user-1", respFriends.Friends[0].User.Id)

	ctx = s.userContext("user-1")
	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("accepted", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFriends.Friends))
	s.Equal("user-2", respFriends.Friends[0].User.Id)
}

func (s *UserServiceTestSuite) Test_Invite_Reject() {
	s.addUser("user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-1")
	respUser, err := s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("", respUser.InviteStatus)

	_, err = s.inviteService.Create(ctx, &rpc.InviteCreateRequest{
		Friend: "user-2",
	})
	s.Nil(err)

	respFromMe, err := s.inviteService.FromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromMe.Invites))
	s.Equal("user-2", respFromMe.Invites[0].FriendId)
	s.Equal("user-2-name", respFromMe.Invites[0].FriendName)
	s.Equal("user-2 user-2", respFromMe.Invites[0].FriendFullName)
	s.NotEmpty(respFromMe.Invites[0].CreatedAt)
	s.Empty(respFromMe.Invites[0].AcceptedAt)
	s.Empty(respFromMe.Invites[0].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err := s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	ctx = s.userContext("user-2")
	respForMe, err := s.inviteService.ForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForMe.Invites))
	s.Equal("user-1", respForMe.Invites[0].FriendId)
	s.Equal("user-1-name", respForMe.Invites[0].FriendName)
	s.Equal("user-1 user-1", respForMe.Invites[0].FriendFullName)
	s.NotEmpty(respForMe.Invites[0].CreatedAt)
	s.Empty(respForMe.Invites[0].AcceptedAt)
	s.Empty(respForMe.Invites[0].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	_, err = s.inviteService.Reject(ctx, &rpc.InviteRejectRequest{
		InviterId: "user-1",
	})
	s.Nil(err)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("rejected", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	ctx = s.userContext("user-1")
	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("rejected", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)
}

func (s *UserServiceTestSuite) Test_Invite_Reject_Accept() {
	s.Test_Invite_Reject()

	ctx := s.userContext("user-1")
	respUser, err := s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("rejected", respUser.InviteStatus)

	_, err = s.inviteService.Create(ctx, &rpc.InviteCreateRequest{
		Friend: "user-2",
	})
	s.Nil(err)

	respFromMe, err := s.inviteService.FromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(2, len(respFromMe.Invites))
	s.Equal("user-2", respFromMe.Invites[0].FriendId)
	s.Equal("user-2-name", respFromMe.Invites[0].FriendName)
	s.Equal("user-2 user-2", respFromMe.Invites[0].FriendFullName)
	s.NotEmpty(respFromMe.Invites[0].CreatedAt)
	s.Empty(respFromMe.Invites[0].AcceptedAt)
	s.Empty(respFromMe.Invites[0].RejectedAt)
	s.Equal("user-2", respFromMe.Invites[1].FriendId)
	s.Equal("user-2-name", respFromMe.Invites[1].FriendName)
	s.Equal("user-2 user-2", respFromMe.Invites[1].FriendFullName)
	s.NotEmpty(respFromMe.Invites[1].CreatedAt)
	s.Empty(respFromMe.Invites[1].AcceptedAt)
	s.NotEmpty(respFromMe.Invites[1].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err := s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	ctx = s.userContext("user-2")
	respForMe, err := s.inviteService.ForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForMe.Invites))
	s.Equal("user-1", respForMe.Invites[0].FriendId)
	s.Equal("user-1-name", respForMe.Invites[0].FriendName)
	s.Equal("user-1 user-1", respForMe.Invites[0].FriendFullName)
	s.NotEmpty(respForMe.Invites[0].CreatedAt)
	s.Empty(respForMe.Invites[0].AcceptedAt)
	s.Empty(respForMe.Invites[0].RejectedAt)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("pending", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFriends.Friends)

	_, err = s.inviteService.Accept(ctx, &rpc.InviteAcceptRequest{
		InviterId: "user-1",
	})
	s.Nil(err)

	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-1",
	})
	s.Nil(err)
	s.Equal("accepted", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFriends.Friends))
	s.Equal("user-1", respFriends.Friends[0].User.Id)

	ctx = s.userContext("user-1")
	respUser, err = s.userService.User(ctx, &rpc.UserUserRequest{
		UserId: "user-2",
	})
	s.Nil(err)
	s.Equal("accepted", respUser.InviteStatus)

	respFriends, err = s.userService.Friends(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFriends.Friends))
	s.Equal("user-2", respFriends.Friends[0].User.Id)
}

func (s *UserServiceTestSuite) userContext(name string) context.Context {
	ctx := context.WithValue(context.Background(), services.ContextUserKey, repo.User{
		ID: name,
	})
	return context.WithValue(ctx, services.ContextIsAdminKey, false)
}

func (s *UserServiceTestSuite) addUser(name string) {
	s.repos.User.AddUser(name, name+"-name", name+"@mail.org", name+" "+name, "", false)
}
