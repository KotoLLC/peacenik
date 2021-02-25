package services_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/mreider/koto/backend/testutils"
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/migrate"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services"
)

type GroupServiceTestSuite struct {
	suite.Suite
	te      *testutils.TestEnvironment
	repos   repo.Repos
	service rpc.GroupService
}

func TestGroupServiceTestSuite(t *testing.T) {
	suite.Run(t, &GroupServiceTestSuite{})
}

func (s *GroupServiceTestSuite) SetupSuite() {
	s.te = testutils.NewTestEnvironment("group_service", migrate.Migrate)
	s.repos = repo.NewRepos(s.te.DB)
	userCache := caches.NewUsers(s.te.DB)
	base := services.NewBase(s.repos, services.BaseServiceOptions{
		UserCache: userCache,
		S3Storage: s.te.Storage,
	})
	s.service = services.NewGroup(base)
}

func (s *GroupServiceTestSuite) SetupTest() {
	_, err := s.te.DB.Exec(`truncate table group_users, group_invites, groups, friends;`)
	s.Require().Nil(err)
	_, err = s.te.DB.Exec(`truncate table users cascade;`)
	s.Require().Nil(err)
}

func (s *GroupServiceTestSuite) TearDownSuite() {
	s.te.Cleanup()
}

func (s *GroupServiceTestSuite) Test_AddGroup_EmptyName() {
	ctx := s.userContext("user-1")
	_, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "",
		Description: "d",
	})
	s.EqualError(err, "twirp error invalid_argument: name shouldn't be empty")
}

func (s *GroupServiceTestSuite) Test_AddGroup_EmptyDescription() {
	ctx := s.userContext("user-1")
	_, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "n",
		Description: "",
	})
	s.EqualError(err, "twirp error invalid_argument: description shouldn't be empty")
}

func (s *GroupServiceTestSuite) Test_AddGroup_InvalidName() {
	ctx := s.userContext("user-1")
	_, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "n\t1",
		Description: "d",
	})
	s.EqualError(err, "twirp error invalid_argument: name is invalid")
}

func (s *GroupServiceTestSuite) Test_AddPrivateGroup() {
	s.addHubAdmin("user-1")
	ctx := s.userContext("user-1")
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "group-1",
		Description: "d",
	})
	s.Nil(err)
	s.True(resp.Group.Id != "")
	s.Equal("group-1", resp.Group.Name)
	s.Equal("d", resp.Group.Description)
	s.Equal(false, resp.Group.IsPublic)

	isGroupMember := s.repos.Group.IsGroupMember(resp.Group.Id, "user-1")
	s.True(isGroupMember)

	members := s.repos.Group.GroupMembers(resp.Group.Id)
	s.Equal(1, len(members))
	s.Equal("user-1", members[0].ID)
}

func (s *GroupServiceTestSuite) Test_AddPublicGroup() {
	s.addHubAdmin("user-1")
	ctx := s.userContext("user-1")
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:         "group-1",
		Description:  "d",
		IsPublic:     true,
		BackgroundId: "back-1",
	})
	s.Nil(err)
	s.True(resp.Group.Id != "")
	s.Equal("group-1", resp.Group.Name)
	s.Equal("d", resp.Group.Description)
	s.Equal(true, resp.Group.IsPublic)

	isGroupMember := s.repos.Group.IsGroupMember(resp.Group.Id, "user-1")
	s.True(isGroupMember)

	members := s.repos.Group.GroupMembers(resp.Group.Id)
	s.Equal(1, len(members))
	s.Equal("user-1", members[0].ID)
}

func (s *GroupServiceTestSuite) Test_AddExistingGroup() {
	s.addHubAdmin("user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-1")
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "group-1",
		Description: "d",
		IsPublic:    true,
	})
	s.Nil(err)
	s.True(resp.Group.Id != "")
	s.Equal("group-1", resp.Group.Name)
	s.Equal("d", resp.Group.Description)
	s.Equal(true, resp.Group.IsPublic)

	ctx = s.userContext("user-2")
	_, err = s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "group-1",
		Description: "d",
		IsPublic:    false,
	})
	s.EqualError(err, "twirp error already_exists: group already exists")
}

func (s *GroupServiceTestSuite) Test_EditGroup_Admin() {
	groupID := s.addPublicGroup("group-1", "user-1")

	ctx := s.userContext("user-1")
	_, err := s.service.EditGroup(ctx, &rpc.GroupEditGroupRequest{
		GroupId:            groupID,
		DescriptionChanged: true,
		Description:        "new description",
		IsPublicChanged:    true,
		IsPublic:           false,
		BackgroundChanged:  true,
		BackgroundId:       "back-2",
	})
	s.Nil(err)

	group := s.repos.Group.FindGroupByID(groupID)
	s.Equal(groupID, group.ID)
	s.Equal("new description", group.Description)
	s.Equal(false, group.IsPublic)
	s.Equal("back-2", group.BackgroundID)
}

func (s *GroupServiceTestSuite) Test_EditGroup_NonAdmin() {
	groupID := s.addPublicGroup("group-1", "user-1")

	ctx := s.userContext("user-2")
	_, err := s.service.EditGroup(ctx, &rpc.GroupEditGroupRequest{
		GroupId:            groupID,
		DescriptionChanged: true,
		Description:        "new description",
		IsPublicChanged:    true,
		IsPublic:           false,
	})
	s.EqualError(err, "twirp error permission_denied: ")
}

func (s *GroupServiceTestSuite) Test_AddUser_NotAdmin() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")

	ctx := s.userContext("user-2")
	_, err := s.service.AddUser(ctx, &rpc.GroupAddUserRequest{
		GroupId: groupID,
		User:    "user-3",
	})
	s.EqualError(err, "twirp error not_found: group not found")
}

func (s *GroupServiceTestSuite) Test_AddUser_Admin() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")

	_, err := s.te.DB.Exec(`
		insert into friends(user_id, friend_id)
		values ($1, $2), ($2, $1);`,
		"user-1", "user-3")
	s.Require().Nil(err)

	ctx := s.userContext("user-1")
	_, err = s.service.AddUser(ctx, &rpc.GroupAddUserRequest{
		GroupId: groupID,
		User:    "user-2",
	})
	s.Nil(err)
	_, err = s.service.AddUser(ctx, &rpc.GroupAddUserRequest{
		GroupId: groupID,
		User:    "user-3",
	})
	s.Nil(err)

	isGroupMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isGroupMember)
	isGroupMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.True(isGroupMember)

	ctx = s.userContext("user-2")
	resp, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(resp.Invites))
	s.Equal(groupID, resp.Invites[0].GroupId)
	s.Equal("group-1", resp.Invites[0].GroupName)
	s.Equal("group-1 description", resp.Invites[0].GroupDescription)
	s.Equal("user-1", resp.Invites[0].InviterId)
	s.Equal("user-1-name", resp.Invites[0].InviterName)
	s.Equal("user-1 user-1", resp.Invites[0].InviterFullName)
	s.NotEmpty(resp.Invites[0].CreatedAt)
	s.Empty(resp.Invites[0].AcceptedAt)
	s.Empty(resp.Invites[0].RejectedAt)
	s.Empty(resp.Invites[0].AcceptedByAdminAt)

	_, err = s.service.DeleteJoinRequest(ctx, &rpc.GroupDeleteJoinRequestRequest{
		GroupId: groupID,
	})
	s.Nil(err)

	isGroupMember = s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isGroupMember)

	ctx = s.userContext("user-2")
	resp, err = s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(resp.Invites)
}

func (s *GroupServiceTestSuite) Test_RequestJoin_PrivateGroup() {
	groupID := s.addPrivateGroup("group-1", "user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.RequestJoin(ctx, &rpc.GroupRequestJoinRequest{
		GroupId: groupID,
		Message: "!123",
	})
	s.EqualError(err, "twirp error not_found: group not found")
}

func (s *GroupServiceTestSuite) Test_RequestJoin_PublicGroup() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.RequestJoin(ctx, &rpc.GroupRequestJoinRequest{
		GroupId: groupID,
		Message: "!123",
	})
	s.Nil(err)

	isGroupMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isGroupMember)

	ctx = s.userContext("user-2")
	resp, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(resp.Invites))
	s.Equal(groupID, resp.Invites[0].GroupId)
	s.Equal("group-1", resp.Invites[0].GroupName)
	s.Equal("group-1 description", resp.Invites[0].GroupDescription)
	s.Equal("user-2", resp.Invites[0].InvitedId)
	s.Equal("user-2-name", resp.Invites[0].InvitedName)
	s.Equal("user-2 user-2", resp.Invites[0].InvitedFullName)
	s.Equal("!123", resp.Invites[0].Message)
	s.NotEmpty(resp.Invites[0].CreatedAt)
	s.NotEmpty(resp.Invites[0].AcceptedAt)
	s.Empty(resp.Invites[0].RejectedAt)
	s.Empty(resp.Invites[0].AcceptedByAdminAt)

	_, err = s.service.DeleteJoinRequest(ctx, &rpc.GroupDeleteJoinRequestRequest{
		GroupId: groupID,
	})
	s.Nil(err)

	isGroupMember = s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isGroupMember)

	ctx = s.userContext("user-2")
	resp, err = s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(resp.Invites)
}

func (s *GroupServiceTestSuite) Test_CreateInvite_SameUser_NotMember() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-2",
		Message: "!123",
	})
	s.Nil(err)
}

func (s *GroupServiceTestSuite) Test_CreateInvite_SameUser_AlreadyMember() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-2",
		Message: "!123",
	})
	s.EqualError(err, "twirp error already_exists: already in the group")
}

func (s *GroupServiceTestSuite) Test_CreateInvite_NotGroupMember() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
		Message: "!123",
	})
	s.EqualError(err, "twirp error permission_denied: not a group member")
}

func (s *GroupServiceTestSuite) Test_CreateInvite() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
		Message: "!123",
	})
	s.Nil(err)
	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)
	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	respForUser2, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respForUser2.Invites)
	respFromUser2, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromUser2.Invites))
	s.Equal(groupID, respFromUser2.Invites[0].GroupId)
	s.Equal("group-1", respFromUser2.Invites[0].GroupName)
	s.Equal("group-1 description", respFromUser2.Invites[0].GroupDescription)
	s.Equal("user-3", respFromUser2.Invites[0].InvitedId)
	s.Equal("user-3-name", respFromUser2.Invites[0].InvitedName)
	s.Equal("user-3 user-3", respFromUser2.Invites[0].InvitedFullName)
	s.Equal("!123", respFromUser2.Invites[0].Message)
	s.NotEmpty(respFromUser2.Invites[0].CreatedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedAt)
	s.Empty(respFromUser2.Invites[0].RejectedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedByAdminAt)

	ctx = s.userContext("user-3")
	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForUser3.Invites))
	s.Equal(groupID, respForUser3.Invites[0].GroupId)
	s.Equal("group-1", respForUser3.Invites[0].GroupName)
	s.Equal("group-1 description", respForUser3.Invites[0].GroupDescription)
	s.Equal("user-2", respForUser3.Invites[0].InviterId)
	s.Equal("user-2-name", respForUser3.Invites[0].InviterName)
	s.Equal("user-2 user-2", respForUser3.Invites[0].InviterFullName)
	s.Equal("!123", respForUser3.Invites[0].Message)
	s.NotEmpty(respForUser3.Invites[0].CreatedAt)
	s.Empty(respForUser3.Invites[0].AcceptedAt)
	s.Empty(respForUser3.Invites[0].RejectedAt)
	s.Empty(respForUser3.Invites[0].AcceptedByAdminAt)

	respFromUser3, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFromUser3.Invites)
}

func (s *GroupServiceTestSuite) Test_CreateInvite_GroupAdmin() {
	groupID := s.addPublicGroup("group-1", "user-2")
	s.addUser("user-3")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
		Message: "!123",
	})
	s.Nil(err)
	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)
	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	respForUser2, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respForUser2.Invites)
	respFromUser2, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromUser2.Invites))
	s.Equal(groupID, respFromUser2.Invites[0].GroupId)
	s.Equal("group-1", respFromUser2.Invites[0].GroupName)
	s.Equal("group-1 description", respFromUser2.Invites[0].GroupDescription)
	s.Equal("user-3", respFromUser2.Invites[0].InvitedId)
	s.Equal("user-3-name", respFromUser2.Invites[0].InvitedName)
	s.Equal("user-3 user-3", respFromUser2.Invites[0].InvitedFullName)
	s.Equal("!123", respFromUser2.Invites[0].Message)
	s.NotEmpty(respFromUser2.Invites[0].CreatedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedAt)
	s.Empty(respFromUser2.Invites[0].RejectedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedByAdminAt)

	ctx = s.userContext("user-3")
	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForUser3.Invites))
	s.Equal(groupID, respForUser3.Invites[0].GroupId)
	s.Equal("group-1", respForUser3.Invites[0].GroupName)
	s.Equal("group-1 description", respForUser3.Invites[0].GroupDescription)
	s.Equal("user-2", respForUser3.Invites[0].InviterId)
	s.Equal("user-2-name", respForUser3.Invites[0].InviterName)
	s.Equal("user-2 user-2", respForUser3.Invites[0].InviterFullName)
	s.Equal("!123", respForUser3.Invites[0].Message)
	s.NotEmpty(respForUser3.Invites[0].CreatedAt)
	s.Empty(respForUser3.Invites[0].AcceptedAt)
	s.Empty(respForUser3.Invites[0].RejectedAt)
	s.Empty(respForUser3.Invites[0].AcceptedByAdminAt)

	respFromUser3, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFromUser3.Invites)
}

func (s *GroupServiceTestSuite) Test_CreateInvite_ByEmail() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3@mail.org",
		Message: "!123",
	})
	s.Nil(err)
	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)
	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	respForUser2, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respForUser2.Invites)
	respFromUser2, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromUser2.Invites))
	s.Equal(groupID, respFromUser2.Invites[0].GroupId)
	s.Equal("group-1", respFromUser2.Invites[0].GroupName)
	s.Equal("group-1 description", respFromUser2.Invites[0].GroupDescription)
	s.Equal("user-3", respFromUser2.Invites[0].InvitedId)
	s.Equal("user-3-name", respFromUser2.Invites[0].InvitedName)
	s.Equal("user-3 user-3", respFromUser2.Invites[0].InvitedFullName)
	s.Equal("!123", respFromUser2.Invites[0].Message)
	s.NotEmpty(respFromUser2.Invites[0].CreatedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedAt)
	s.Empty(respFromUser2.Invites[0].RejectedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedByAdminAt)

	ctx = s.userContext("user-3")
	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForUser3.Invites))
	s.Equal(groupID, respForUser3.Invites[0].GroupId)
	s.Equal("group-1", respForUser3.Invites[0].GroupName)
	s.Equal("group-1 description", respForUser3.Invites[0].GroupDescription)
	s.Equal("user-2", respForUser3.Invites[0].InviterId)
	s.Equal("user-2-name", respForUser3.Invites[0].InviterName)
	s.Equal("user-2 user-2", respForUser3.Invites[0].InviterFullName)
	s.Equal("!123", respForUser3.Invites[0].Message)
	s.NotEmpty(respForUser3.Invites[0].CreatedAt)
	s.Empty(respForUser3.Invites[0].AcceptedAt)
	s.Empty(respForUser3.Invites[0].RejectedAt)
	s.Empty(respForUser3.Invites[0].AcceptedByAdminAt)

	respFromUser3, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respFromUser3.Invites)
}

func (s *GroupServiceTestSuite) Test_CreateInvite_UnregisteredUser() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3@mail.org",
		Message: "!123",
	})
	s.Nil(err)
	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)
	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	respForUser2, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(respForUser2.Invites)
	respFromUser2, err := s.service.InvitesFromMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respFromUser2.Invites))
	s.Equal(groupID, respFromUser2.Invites[0].GroupId)
	s.Equal("group-1", respFromUser2.Invites[0].GroupName)
	s.Equal("group-1 description", respFromUser2.Invites[0].GroupDescription)
	s.Equal("", respFromUser2.Invites[0].InvitedId)
	s.Equal("user-3@mail.org", respFromUser2.Invites[0].InvitedName)
	s.Equal("", respFromUser2.Invites[0].InvitedFullName)
	s.Equal("!123", respFromUser2.Invites[0].Message)
	s.NotEmpty(respFromUser2.Invites[0].CreatedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedAt)
	s.Empty(respFromUser2.Invites[0].RejectedAt)
	s.Empty(respFromUser2.Invites[0].AcceptedByAdminAt)
}

func (s *GroupServiceTestSuite) Test_AcceptInvite() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
	})
	s.Require().Nil(err)

	ctx = s.userContext("user-3")
	_, err = s.service.AcceptInvite(ctx, &rpc.GroupAcceptInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
	})
	s.Nil(err)

	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForUser3.Invites))
	s.Equal(groupID, respForUser3.Invites[0].GroupId)
	s.Equal("group-1", respForUser3.Invites[0].GroupName)
	s.Equal("group-1 description", respForUser3.Invites[0].GroupDescription)
	s.Equal("user-2", respForUser3.Invites[0].InviterId)
	s.Equal("user-2-name", respForUser3.Invites[0].InviterName)
	s.Equal("user-2 user-2", respForUser3.Invites[0].InviterFullName)
	s.NotEmpty(respForUser3.Invites[0].CreatedAt)
	s.NotEmpty(respForUser3.Invites[0].AcceptedAt)
	s.Empty(respForUser3.Invites[0].RejectedAt)
	s.Empty(respForUser3.Invites[0].AcceptedByAdminAt)

	isMember := s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	areFriends := s.repos.Friend.AreFriends("user-1", "user-3")
	s.False(areFriends)
}

func (s *GroupServiceTestSuite) Test_AcceptInvite_FromGroupAdmin() {
	groupID := s.addPublicGroup("group-1", "user-2")
	s.addUser("user-3")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
	})
	s.Require().Nil(err)

	ctx = s.userContext("user-3")
	_, err = s.service.AcceptInvite(ctx, &rpc.GroupAcceptInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
	})
	s.Nil(err)

	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(0, len(respForUser3.Invites))

	isMember := s.repos.Group.IsGroupMember(groupID, "user-3")
	s.True(isMember)

	areFriends := s.repos.Friend.AreFriends("user-2", "user-3")
	s.True(areFriends)
}

func (s *GroupServiceTestSuite) Test_RejectInvite() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
	})
	s.Require().Nil(err)

	ctx = s.userContext("user-3")
	_, err = s.service.RejectInvite(ctx, &rpc.GroupRejectInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
	})
	s.Nil(err)

	respForUser3, err := s.service.InvitesForMe(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(respForUser3.Invites))
	s.Equal(groupID, respForUser3.Invites[0].GroupId)
	s.Equal("group-1", respForUser3.Invites[0].GroupName)
	s.Equal("group-1 description", respForUser3.Invites[0].GroupDescription)
	s.Equal("user-2", respForUser3.Invites[0].InviterId)
	s.Equal("user-2-name", respForUser3.Invites[0].InviterName)
	s.Equal("user-2 user-2", respForUser3.Invites[0].InviterFullName)
	s.NotEmpty(respForUser3.Invites[0].CreatedAt)
	s.Empty(respForUser3.Invites[0].AcceptedAt)
	s.NotEmpty(respForUser3.Invites[0].RejectedAt)
	s.Empty(respForUser3.Invites[0].AcceptedByAdminAt)

	isMember := s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)
}

func (s *GroupServiceTestSuite) Test_ConfirmInvite() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
		Message: "!123",
	})
	s.Require().Nil(err)

	ctx = s.userContext("user-3")
	_, err = s.service.AcceptInvite(ctx, &rpc.GroupAcceptInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
	})
	s.Require().Nil(err)

	isMember := s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	_, err = s.service.ConfirmInvite(ctx, &rpc.GroupConfirmInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
		InvitedId: "user-3",
	})
	s.EqualError(err, "twirp error permission_denied: ")

	ctx = s.userContext("user-1")

	resp, err := s.service.InvitesToConfirm(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(resp.Groups))
	s.Equal(groupID, resp.Groups[0].Group.Id)
	s.Equal("group-1", resp.Groups[0].Group.Name)
	s.Equal("group-1 description", resp.Groups[0].Group.Description)
	s.Equal(true, resp.Groups[0].Group.IsPublic)
	s.Equal(1, len(resp.Groups[0].Invites))
	s.Equal("user-2", resp.Groups[0].Invites[0].InviterId)
	s.Equal("user-2-name", resp.Groups[0].Invites[0].InviterName)
	s.Equal("user-2 user-2", resp.Groups[0].Invites[0].InviterFullName)
	s.Equal("user-3", resp.Groups[0].Invites[0].InvitedId)
	s.Equal("user-3-name", resp.Groups[0].Invites[0].InvitedName)
	s.Equal("user-3 user-3", resp.Groups[0].Invites[0].InvitedFullName)
	s.Equal("!123", resp.Groups[0].Invites[0].Message)
	s.NotEmpty(resp.Groups[0].Invites[0].CreatedAt)
	s.NotEmpty(resp.Groups[0].Invites[0].AcceptedAt)
	s.Empty(resp.Groups[0].Invites[0].RejectedAt)
	s.Empty(resp.Groups[0].Invites[0].AcceptedByAdminAt)
	s.Empty(resp.Groups[0].Invites[0].RejectedByAdminAt)

	areFriends := s.repos.Friend.AreFriends("user-1", "user-3")
	s.False(areFriends)

	_, err = s.service.ConfirmInvite(ctx, &rpc.GroupConfirmInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
		InvitedId: "user-3",
	})
	s.Nil(err)

	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.True(isMember)

	resp, err = s.service.InvitesToConfirm(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(len(resp.Groups))

	areFriends = s.repos.Friend.AreFriends("user-1", "user-3")
	s.True(areFriends)
}

func (s *GroupServiceTestSuite) Test_DenyInvite() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.CreateInvite(ctx, &rpc.GroupCreateInviteRequest{
		GroupId: groupID,
		Invited: "user-3",
		Message: "!123",
	})
	s.Require().Nil(err)

	ctx = s.userContext("user-3")
	_, err = s.service.AcceptInvite(ctx, &rpc.GroupAcceptInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
	})
	s.Require().Nil(err)

	isMember := s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	_, err = s.service.DenyInvite(ctx, &rpc.GroupDenyInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
		InvitedId: "user-3",
	})
	s.EqualError(err, "twirp error permission_denied: ")

	ctx = s.userContext("user-1")

	resp, err := s.service.InvitesToConfirm(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Equal(1, len(resp.Groups))
	s.Equal(groupID, resp.Groups[0].Group.Id)
	s.Equal("group-1", resp.Groups[0].Group.Name)
	s.Equal("group-1 description", resp.Groups[0].Group.Description)
	s.Equal(true, resp.Groups[0].Group.IsPublic)
	s.Equal(1, len(resp.Groups[0].Invites))
	s.Equal("user-2", resp.Groups[0].Invites[0].InviterId)
	s.Equal("user-2-name", resp.Groups[0].Invites[0].InviterName)
	s.Equal("user-2 user-2", resp.Groups[0].Invites[0].InviterFullName)
	s.Equal("user-3", resp.Groups[0].Invites[0].InvitedId)
	s.Equal("user-3-name", resp.Groups[0].Invites[0].InvitedName)
	s.Equal("user-3 user-3", resp.Groups[0].Invites[0].InvitedFullName)
	s.Equal("!123", resp.Groups[0].Invites[0].Message)
	s.NotEmpty(resp.Groups[0].Invites[0].CreatedAt)
	s.NotEmpty(resp.Groups[0].Invites[0].AcceptedAt)
	s.Empty(resp.Groups[0].Invites[0].RejectedAt)
	s.Empty(resp.Groups[0].Invites[0].AcceptedByAdminAt)
	s.Empty(resp.Groups[0].Invites[0].RejectedByAdminAt)

	areFriends := s.repos.Friend.AreFriends("user-1", "user-3")
	s.False(areFriends)

	_, err = s.service.DenyInvite(ctx, &rpc.GroupDenyInviteRequest{
		GroupId:   groupID,
		InviterId: "user-2",
		InvitedId: "user-3",
	})
	s.Nil(err)

	isMember = s.repos.Group.IsGroupMember(groupID, "user-3")
	s.False(isMember)

	resp, err = s.service.InvitesToConfirm(ctx, &rpc.Empty{})
	s.Nil(err)
	s.Empty(len(resp.Groups))

	areFriends = s.repos.Friend.AreFriends("user-1", "user-3")
	s.False(areFriends)
}

func (s *GroupServiceTestSuite) Test_RemoveUser() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-2")
	_, err := s.service.RemoveUser(ctx, &rpc.GroupRemoveUserRequest{
		GroupId: groupID,
		UserId:  "user-1",
	})
	s.EqualError(err, "twirp error permission_denied: ")

	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)

	ctx = s.userContext("user-1")
	_, err = s.service.RemoveUser(ctx, &rpc.GroupRemoveUserRequest{
		GroupId: groupID,
		UserId:  "user-1",
	})
	s.EqualError(err, "twirp error invalid_argument: can't delete himself")
	_, err = s.service.RemoveUser(ctx, &rpc.GroupRemoveUserRequest{
		GroupId: groupID,
		UserId:  "user-3",
	})
	s.Nil(err)
	_, err = s.service.RemoveUser(ctx, &rpc.GroupRemoveUserRequest{
		GroupId: groupID,
		UserId:  "user-2",
	})
	s.Nil(err)

	isMember = s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isMember)
}

func (s *GroupServiceTestSuite) Test_LeaveGroup() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addUser("user-3")
	s.addGroupUser(groupID, "user-2")

	ctx := s.userContext("user-3")
	_, err := s.service.LeaveGroup(ctx, &rpc.GroupLeaveGroupRequest{
		GroupId: groupID,
	})
	s.Nil(err)

	ctx = s.userContext("user-1")
	_, err = s.service.LeaveGroup(ctx, &rpc.GroupLeaveGroupRequest{
		GroupId: groupID,
	})
	s.EqualError(err, "twirp error invalid_argument: admin can't leave the group")

	isMember := s.repos.Group.IsGroupMember(groupID, "user-2")
	s.True(isMember)

	ctx = s.userContext("user-2")
	_, err = s.service.LeaveGroup(ctx, &rpc.GroupLeaveGroupRequest{
		GroupId: groupID,
	})
	s.Nil(err)

	isMember = s.repos.Group.IsGroupMember(groupID, "user-2")
	s.False(isMember)
}

func (s *GroupServiceTestSuite) Test_DeleteGroup() {
	groupID := s.addPublicGroup("group-1", "user-1")
	s.addUser("user-2")
	s.addGroupUser(groupID, "user-2")

	g := s.repos.Group.FindGroupByID(groupID)
	s.NotNil(g)
	s.Equal(groupID, g.ID)

	ctx := s.userContext("user-1")
	_, err := s.service.DeleteGroup(ctx, &rpc.GroupDeleteGroupRequest{
		GroupId: groupID,
	})
	s.Nil(err)

	g = s.repos.Group.FindGroupByID(groupID)
	s.Nil(g)
}

func (s *GroupServiceTestSuite) userContext(name string) context.Context {
	ctx := context.WithValue(context.Background(), services.ContextUserKey, repo.User{
		ID: name,
	})
	return context.WithValue(ctx, services.ContextIsAdminKey, false)
}

func (s *GroupServiceTestSuite) addUser(name string) {
	s.repos.User.AddUser(name, name+"-name", name+"@mail.org", name+" "+name, "", false)
}

func (s *GroupServiceTestSuite) addHubAdmin(userName string) {
	s.addUser(userName)
	s.repos.MessageHubs.AddHub(userName+"-hub", userName+"-details", userName, 0, false)
}

func (s *GroupServiceTestSuite) addPublicGroup(name, adminName string) string {
	s.addHubAdmin(adminName)

	ctx := s.userContext(adminName)
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        name,
		Description: name + " description",
		IsPublic:    true,
	})
	s.Require().Nil(err)

	return resp.Group.Id
}

func (s *GroupServiceTestSuite) addPrivateGroup(name, adminName string) string {
	s.addHubAdmin(adminName)

	ctx := s.userContext(adminName)
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        name,
		Description: name + " description",
		IsPublic:    false,
	})
	s.Require().Nil(err)

	return resp.Group.Id
}

func (s *GroupServiceTestSuite) addGroupUser(groupID, userID string) {
	s.repos.Group.AddUserToGroup(groupID, userID)
}
