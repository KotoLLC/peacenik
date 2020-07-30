package services

import (
	"context"
	"errors"
	"log"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/common"
)

type inviteService struct {
	*BaseService
}

func NewInvite(base *BaseService) rpc.InviteService {
	return &inviteService{
		BaseService: base,
	}
}

func (s *inviteService) Create(ctx context.Context, r *rpc.InviteCreateRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if r.Friend == "" || r.Friend == user.ID || r.Friend == user.Name || r.Friend == user.Email {
		return nil, twirp.NewError(twirp.InvalidArgument, "")
	}

	friend, err := s.repos.User.FindUser(r.Friend)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	if friend != nil {
		err = s.repos.Invite.AddInvite(user.ID, friend.ID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
		err = s.repos.Notification.AddNotification(friend.ID, user.Name+" invited you to be friends", "invite/add", map[string]interface{}{
			"user_id": user.ID,
		})
		if err != nil {
			log.Println(err)
		}
	} else {
		err = s.repos.Invite.AddInviteByEmail(user.ID, r.Friend)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *inviteService) Accept(ctx context.Context, r *rpc.InviteAcceptRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Invite.AcceptInvite(r.InviterId, user.ID)
	if err != nil {
		if errors.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	err = s.repos.Notification.AddNotification(r.InviterId, user.Name+" accepted your invite!", "invite/accept", map[string]interface{}{
		"user_id": user.ID,
	})
	if err != nil {
		log.Println(err)
	}
	return &rpc.Empty{}, nil
}

func (s *inviteService) Reject(ctx context.Context, r *rpc.InviteRejectRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Invite.RejectInvite(r.InviterId, user.ID)
	if err != nil {
		if errors.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	err = s.repos.Notification.AddNotification(r.InviterId, user.Name+" rejected your invite", "invite/reject", map[string]interface{}{
		"user_id": user.ID,
	})
	if err != nil {
		log.Println(err)
	}
	return &rpc.Empty{}, nil
}

func (s *inviteService) FromMe(ctx context.Context, _ *rpc.Empty) (*rpc.InviteFromMeResponse, error) {
	user := s.getUser(ctx)
	invites, err := s.repos.Invite.InvitesFromMe(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		friendName := invite.FriendName
		if invite.FriendID == "" {
			friendName = invite.FriendEmail
		}

		friendAvatarLink, err := s.createBlobLink(ctx, invite.FriendAvatarID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcInvites[i] = &rpc.InviteFriendInvite{
			FriendId:     invite.FriendID,
			FriendName:   friendName,
			FriendAvatar: friendAvatarLink,
			CreatedAt:    common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:   common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:   common.NullTimeToRPCString(invite.RejectedAt),
		}
	}

	return &rpc.InviteFromMeResponse{
		Invites: rpcInvites,
	}, nil
}

func (s *inviteService) ForMe(ctx context.Context, _ *rpc.Empty) (*rpc.InviteForMeResponse, error) {
	user := s.getUser(ctx)
	invites, err := s.repos.Invite.InvitesForMe(user)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		userAvatarLink, err := s.createBlobLink(ctx, invite.UserAvatarID)
		if err != nil {
			return nil, twirp.InternalErrorWith(err)
		}

		rpcInvites[i] = &rpc.InviteFriendInvite{
			FriendId:     invite.UserID,
			FriendName:   invite.UserName,
			FriendAvatar: userAvatarLink,
			CreatedAt:    common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:   common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:   common.NullTimeToRPCString(invite.RejectedAt),
		}
	}

	return &rpc.InviteForMeResponse{
		Invites: rpcInvites,
	}, nil
}
