package services

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/mreider/koto/backend/testutils"
	"github.com/mreider/koto/backend/userhub/config"
	"github.com/mreider/koto/backend/userhub/migrate"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
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
	base := NewBase(s.repos, s.te.Storage, nil, nil, nil, config.Config{}, nil)
	s.service = NewGroup(base)
}

func (s *GroupServiceTestSuite) SetupTest() {
	_, err := s.te.DB.Exec(`truncate table group_users, group_invites, groups;`)
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
		Name:        "n 1",
		Description: "d",
	})
	s.EqualError(err, "twirp error invalid_argument: name is invalid")
}

func (s *GroupServiceTestSuite) Test_AddPrivateGroup() {
	s.addUser("user-1")
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
	s.Equal("", resp.Group.AvatarOriginal)

	isGroupMember, err := s.repos.Group.IsGroupMember(resp.Group.Id, "user-1")
	s.Nil(err)
	s.True(isGroupMember)

	members, err := s.repos.Group.GroupMembers(resp.Group.Id)
	s.Nil(err)
	s.Equal(1, len(members))
	s.Equal("user-1", members[0].ID)
}

func (s *GroupServiceTestSuite) Test_AddPublicGroup() {
	s.addUser("user-1")
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
	s.Equal("", resp.Group.AvatarOriginal)

	isGroupMember, err := s.repos.Group.IsGroupMember(resp.Group.Id, "user-1")
	s.Nil(err)
	s.True(isGroupMember)

	members, err := s.repos.Group.GroupMembers(resp.Group.Id)
	s.Nil(err)
	s.Equal(1, len(members))
	s.Equal("user-1", members[0].ID)
}

func (s *GroupServiceTestSuite) Test_AddExistingGroup() {
	s.addUser("user-1")
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
	s.Equal("", resp.Group.AvatarOriginal)

	ctx = s.userContext("user-2")
	_, err = s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        "group-1",
		Description: "d",
		IsPublic:    false,
	})
	s.EqualError(err, "twirp error already_exists: group already exists")
}

func (s *GroupServiceTestSuite) Test_EditGroup_Admin() {
	groupID := s.addGroup("group-1", "user-1")

	ctx := s.userContext("user-1")
	_, err := s.service.EditGroup(ctx, &rpc.GroupEditGroupRequest{
		GroupId:            groupID,
		DescriptionChanged: true,
		Description:        "new description",
		IsPublicChanged:    true,
		IsPublic:           false,
	})
	s.Nil(err)

	group, err := s.repos.Group.FindGroupByID(groupID)
	s.Nil(err)
	s.Equal(groupID, group.ID)
	s.Equal("new description", group.Description)
	s.Equal(false, group.IsPublic)
}

func (s *GroupServiceTestSuite) Test_EditGroup_NonAdmin() {
	groupID := s.addGroup("group-1", "user-1")

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

func (s *GroupServiceTestSuite) userContext(name string) context.Context {
	ctx := context.WithValue(context.Background(), ContextUserKey, repo.User{
		ID:       name,
		Name:     name,
		FullName: name + " " + name,
	})
	return context.WithValue(ctx, ContextIsAdminKey, false)
}

func (s *GroupServiceTestSuite) addUser(name string) {
	err := s.repos.User.AddUser(name, name, name+"@mail.org", name+" "+name, "")
	s.Require().Nil(err)
}

func (s *GroupServiceTestSuite) addGroup(name, adminName string) string {
	s.addUser(adminName)

	ctx := s.userContext(adminName)
	resp, err := s.service.AddGroup(ctx, &rpc.GroupAddGroupRequest{
		Name:        name,
		Description: name + " description",
		IsPublic:    true,
	})
	s.Require().Nil(err)

	return resp.Group.Id
}
