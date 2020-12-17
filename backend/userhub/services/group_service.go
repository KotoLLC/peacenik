package services

import (
	"context"
	"strings"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

func NewGroup(base *BaseService) rpc.GroupService {
	return &groupService{
		BaseService: base,
	}
}

type groupService struct {
	*BaseService
}

func (s *groupService) AddGroup(ctx context.Context, r *rpc.GroupAddGroupRequest) (*rpc.GroupAddGroupResponse, error) {
	user := s.getUser(ctx)

	if r.Name == "" {
		return nil, twirp.InvalidArgumentError("name", "shouldn't be empty")
	}
	if r.Description == "" {
		return nil, twirp.InvalidArgumentError("description", "shouldn't be empty")
	}
	r.Name = strings.TrimSpace(r.Name)
	if !groupNameRe.MatchString(r.Name) {
		return nil, twirp.InvalidArgumentError("name", "is invalid")
	}

	group, err := s.repos.Group.FindGroupByName(r.Name)
	if err != nil {
		return nil, err
	}
	if group != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "group already exists")
	}

	groupID := common.GenerateUUID()

	err = s.repos.Group.AddGroup(groupID, r.Name, r.Description, user.ID, r.IsPublic)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	group, err = s.repos.Group.FindGroupByID(groupID)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}

	if r.AvatarId != "" {
		err := s.setAvatar(ctx, *group, r.AvatarId)
		if err != nil {
			return nil, err
		}
	}

	return &rpc.GroupAddGroupResponse{
		Group: &rpc.Group{
			Id:          group.ID,
			Name:        group.Name,
			Description: group.Description,
			IsPublic:    group.IsPublic,
		},
	}, nil
}

func (s *groupService) EditGroup(ctx context.Context, r *rpc.GroupEditGroupRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	group, err := s.repos.Group.FindGroupByID(r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if group.AdminID != user.ID {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	if r.DescriptionChanged {
		if r.Description == "" {
			return nil, twirp.InvalidArgumentError("description", "is empty")
		}
		if r.Description != user.Email {
			err := s.repos.Group.SetDescription(group.ID, r.Description)
			if err != nil {
				return nil, err
			}
		}
	}

	if r.IsPublicChanged {
		err = s.repos.Group.SetIsPublic(group.ID, r.IsPublic)
		if err != nil {
			return nil, err
		}
	}

	if r.AvatarChanged {
		err := s.setAvatar(ctx, *group, r.AvatarId)
		if err != nil {
			return nil, merry.Wrap(err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *groupService) setAvatar(ctx context.Context, group repo.Group, avatarID string) (err error) {
	if group.AvatarOriginalID == avatarID {
		return nil
	}

	if avatarID == "" {
		err := s.repos.Group.SetAvatar(group.ID, "", "")
		if err != nil {
			return merry.Wrap(err)
		}
		return nil
	}

	thumbnailID, err := s.saveThumbnail(ctx, avatarID)
	if err != nil {
		return merry.Wrap(err)
	}

	err = s.repos.Group.SetAvatar(group.ID, avatarID, thumbnailID)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}
