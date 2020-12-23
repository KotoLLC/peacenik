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
	group, isGroupAdmin, err := s.getGroup(ctx, r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if !isGroupAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	if r.DescriptionChanged {
		if r.Description == "" {
			return nil, twirp.InvalidArgumentError("description", "is empty")
		}
		if r.Description != group.Description {
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

func (s *groupService) CreateInvite(ctx context.Context, r *rpc.GroupCreateInviteRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.GroupId == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "group_id")
	}
	if r.Invited == "" || r.Invited == user.ID || r.Invited == user.Name || r.Invited == user.Email {
		return nil, twirp.NewError(twirp.InvalidArgument, "invited")
	}

	group, err := s.repos.Group.FindGroupByID(r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}

	isGroupMember, err := s.repos.Group.IsGroupMember(group.ID, user.ID)
	if err != nil {
		return nil, err
	}
	if !isGroupMember {
		return nil, twirp.NewError(twirp.PermissionDenied, "not a group member")
	}

	invitedUser, err := s.repos.User.FindUserByIDOrName(r.Invited)
	if err != nil {
		return nil, err
	}

	if invitedUser == nil {
		if strings.Contains(r.Invited, "@") && strings.Contains(r.Invited, ".") {
			friends, err := s.repos.User.FindUsersByEmail(r.Invited)
			if err != nil {
				return nil, err
			}
			if len(friends) == 1 {
				invitedUser = &friends[0]
			} else if len(friends) > 1 {
				return nil, twirp.NewError(twirp.AlreadyExists, "Email belongs to more than one account. Invite by username instead.")
			}
		} else {
			return nil, twirp.NotFoundError("user not found")
		}
	}

	if invitedUser != nil {
		areBlocked, err := s.repos.User.AreBlocked(user.ID, invitedUser.ID)
		if err != nil {
			return nil, err
		}
		if areBlocked {
			return nil, twirp.NotFoundError("user not found")
		}

		isGroupMember, err := s.repos.Group.IsGroupMember(group.ID, invitedUser.ID)
		if err != nil {
			return nil, err
		}
		if isGroupMember {
			return nil, twirp.NewError(twirp.AlreadyExists, "already in the group.")
		}

		err = s.repos.Group.AddInvite(group.ID, user.ID, invitedUser.ID)
		if err != nil {
			return nil, err
		}
		if s.notificationSender != nil {
			s.notificationSender.SendNotification([]string{invitedUser.ID}, user.DisplayName()+" invited you to the group "+group.Name+"", "group-invite/add", map[string]interface{}{
				"group_id": group.ID,
				"user_id":  user.ID,
			})
		}
		// TODO:
		//err = s.sendInviteLinkToRegisteredUser(ctx, user, invitedUser.Email)
		//if err != nil {
		//	log.Println("can't invite by email:", err)
		//}
	} else {
		err = s.repos.Group.AddInviteByEmail(group.ID, user.ID, r.Invited)
		if err != nil {
			return nil, err
		}

		// TODO
		//err = s.sendInviteLinkToUnregisteredUser(ctx, user, r.Invited)
		//if err != nil {
		//	log.Println("can't invite by email:", err)
		//}
	}

	return &rpc.Empty{}, nil
}

func (s *groupService) AcceptInvite(ctx context.Context, r *rpc.GroupAcceptInviteRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.GroupId == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "group_id")
	}

	err := s.repos.Group.AcceptInvite(r.GroupId, r.InviterId, user.ID)
	if err != nil {
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}

	// TODO
	if s.notificationSender != nil {
		s.notificationSender.SendNotification([]string{r.InviterId}, user.DisplayName()+" accepted your invite!", "group-invite/accept", map[string]interface{}{
			"group_id": r.GroupId,
			"user_id":  user.ID,
		})
	}
	return &rpc.Empty{}, nil
}

func (s *groupService) RejectInvite(ctx context.Context, r *rpc.GroupRejectInviteRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	if r.GroupId == "" {
		return nil, twirp.NewError(twirp.InvalidArgument, "group_id")
	}

	err := s.repos.Group.RejectInvite(r.GroupId, r.InviterId, user.ID)
	if err != nil {
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}
	// TODO
	if s.notificationSender != nil {
		s.notificationSender.SendNotification([]string{r.InviterId}, user.DisplayName()+" rejected your invite", "group-invite/reject", map[string]interface{}{
			"group_id": r.GroupId,
			"user_id":  user.ID,
		})
	}
	return &rpc.Empty{}, nil
}

func (s *groupService) InvitesFromMe(ctx context.Context, _ *rpc.Empty) (*rpc.GroupInvitesFromMeResponse, error) {
	user := s.getUser(ctx)
	invites, err := s.repos.Group.InvitesFromMe(user)
	if err != nil {
		return nil, err
	}
	rpcInvites := make([]*rpc.GroupInvite, len(invites))
	for i, invite := range invites {
		invitedName, invitedFullName := invite.InvitedName, invite.InvitedFullName
		if invite.InvitedID == "" {
			invitedName = invite.InvitedEmail
			invitedFullName = ""
		}

		rpcInvites[i] = &rpc.GroupInvite{
			GroupId:           invite.GroupID,
			GroupName:         invite.GroupName,
			GroupDescription:  invite.GroupDescription,
			InvitedId:         invite.InvitedID,
			InvitedName:       invitedName,
			InvitedFullName:   invitedFullName,
			CreatedAt:         common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:        common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:        common.NullTimeToRPCString(invite.RejectedAt),
			AcceptedByAdminAt: common.NullTimeToRPCString(invite.AcceptedByAdminAt),
		}
	}

	return &rpc.GroupInvitesFromMeResponse{
		Invites: rpcInvites,
	}, nil
}

func (s *groupService) InvitesForMe(ctx context.Context, _ *rpc.Empty) (*rpc.GroupInvitesForMeResponse, error) {
	user := s.getUser(ctx)
	invites, err := s.repos.Group.InvitesForMe(user)
	if err != nil {
		return nil, err
	}
	rpcInvites := make([]*rpc.GroupInvite, len(invites))
	for i, invite := range invites {
		rpcInvites[i] = &rpc.GroupInvite{
			GroupId:           invite.GroupID,
			GroupName:         invite.GroupName,
			GroupDescription:  invite.GroupDescription,
			InviterId:         invite.InviterID,
			InviterName:       invite.InviterName,
			InviterFullName:   invite.InviterFullName,
			CreatedAt:         common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:        common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:        common.NullTimeToRPCString(invite.RejectedAt),
			AcceptedByAdminAt: common.NullTimeToRPCString(invite.AcceptedByAdminAt),
		}
	}

	return &rpc.GroupInvitesForMeResponse{
		Invites: rpcInvites,
	}, nil
}

func (s *groupService) LeaveGroup(ctx context.Context, r *rpc.GroupLeaveGroupRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)

	group, isGroupAdmin, err := s.getGroup(ctx, r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if isGroupAdmin {
		return nil, twirp.NewError(twirp.InvalidArgument, "admin can't leave the group")
	}

	err = s.repos.Group.RemoveUserFromGroup(r.GroupId, user.ID)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *groupService) RemoveUser(ctx context.Context, r *rpc.GroupRemoveUserRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	group, isGroupAdmin, err := s.getGroup(ctx, r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if !isGroupAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}
	if user.ID == r.UserId {
		return nil, twirp.NewError(twirp.InvalidArgument, "can't delete himself")
	}

	err = s.repos.Group.RemoveUserFromGroup(r.GroupId, r.UserId)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *groupService) ConfirmInvite(ctx context.Context, r *rpc.GroupConfirmInviteRequest) (*rpc.Empty, error) {
	group, isGroupAdmin, err := s.getGroup(ctx, r.GroupId)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, twirp.NotFoundError("group not found")
	}
	if !isGroupAdmin {
		return nil, twirp.NewError(twirp.PermissionDenied, "")
	}

	err = s.repos.Group.ConfirmInvite(r.GroupId, r.InviterId, r.InvitedId)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *groupService) InvitesToConfirm(ctx context.Context, _ *rpc.Empty) (*rpc.GroupInvitesToConfirmResponse, error) {
	user := s.getUser(ctx)
	invites, err := s.repos.Group.InvitesToConfirm(user.ID)
	if err != nil {
		return nil, err
	}

	groupSet := make(map[string]*rpc.GroupInvites)
	var groups []*rpc.GroupInvites
	for _, invite := range invites {
		rpcInvite := &rpc.GroupInvite{
			InviterId:         invite.InviterID,
			InviterName:       invite.InviterName,
			InviterFullName:   invite.InviterFullName,
			InvitedId:         invite.InvitedID,
			InvitedName:       invite.InvitedName,
			InvitedFullName:   invite.InvitedFullName,
			CreatedAt:         common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:        common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:        common.NullTimeToRPCString(invite.RejectedAt),
			AcceptedByAdminAt: common.NullTimeToRPCString(invite.AcceptedByAdminAt),
		}

		if _, ok := groupSet[invite.GroupID]; !ok {
			gi := &rpc.GroupInvites{
				Group: &rpc.Group{
					Id:          invite.GroupID,
					Name:        invite.GroupName,
					Description: invite.GroupDescription,
					IsPublic:    invite.GroupIsPublic,
				},
				Invites: []*rpc.GroupInvite{rpcInvite},
			}
			groupSet[invite.GroupID] = gi
			groups = append(groups, gi)
		} else {
			groupSet[invite.GroupID].Invites = append(groupSet[invite.GroupID].Invites, rpcInvite)
		}
	}

	return &rpc.GroupInvitesToConfirmResponse{
		Groups: groups,
	}, nil
}
