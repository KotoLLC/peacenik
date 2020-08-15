package services

import (
	"context"
	"log"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services/user"
)

type inviteService struct {
	*BaseService
	userConfirmation *user.Confirmation
}

func NewInvite(base *BaseService, userConfirmation *user.Confirmation) rpc.InviteService {
	return &inviteService{
		BaseService:      base,
		userConfirmation: userConfirmation,
	}
}

func (s *inviteService) Create(ctx context.Context, r *rpc.InviteCreateRequest) (*rpc.Empty, error) {
	u := s.getUser(ctx)
	if r.Friend == "" || r.Friend == u.ID || r.Friend == u.Name || r.Friend == u.Email {
		return nil, twirp.NewError(twirp.InvalidArgument, "")
	}

	friend, err := s.repos.User.FindUser(r.Friend)
	if err != nil {
		return nil, err
	}

	if friend != nil {
		err = s.repos.Invite.AddInvite(u.ID, friend.ID)
		if err != nil {
			return nil, err
		}
		err = s.repos.Notification.AddNotification(friend.ID, u.Name+" invited you to be friends", "invite/add", map[string]interface{}{
			"user_id": u.ID,
		})
		if err != nil {
			log.Println(err)
		}
		if s.userConfirmation != nil {
			err = s.userConfirmation.SendInviteLinkToRegisteredUser(u, friend.Email)
			if err != nil {
				log.Println("can't invite by email:", err)
			}
		}
	} else {
		err = s.repos.Invite.AddInviteByEmail(u.ID, r.Friend)
		if err != nil {
			return nil, err
		}

		if s.userConfirmation != nil {
			err = s.userConfirmation.SendInviteLinkToUnregisteredUser(u, r.Friend)
			if err != nil {
				log.Println("can't invite by email:", err)
			}
		}
	}

	return &rpc.Empty{}, nil
}

func (s *inviteService) Accept(ctx context.Context, r *rpc.InviteAcceptRequest) (*rpc.Empty, error) {
	u := s.getUser(ctx)
	err := s.repos.Invite.AcceptInvite(r.InviterId, u.ID)
	if err != nil {
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}
	err = s.repos.Notification.AddNotification(r.InviterId, u.Name+" accepted your invite!", "invite/accept", map[string]interface{}{
		"user_id": u.ID,
	})
	if err != nil {
		log.Println(err)
	}
	return &rpc.Empty{}, nil
}

func (s *inviteService) Reject(ctx context.Context, r *rpc.InviteRejectRequest) (*rpc.Empty, error) {
	u := s.getUser(ctx)
	err := s.repos.Invite.RejectInvite(r.InviterId, u.ID)
	if err != nil {
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
	}
	err = s.repos.Notification.AddNotification(r.InviterId, u.Name+" rejected your invite", "invite/reject", map[string]interface{}{
		"user_id": u.ID,
	})
	if err != nil {
		log.Println(err)
	}
	return &rpc.Empty{}, nil
}

func (s *inviteService) FromMe(ctx context.Context, _ *rpc.Empty) (*rpc.InviteFromMeResponse, error) {
	u := s.getUser(ctx)
	invites, err := s.repos.Invite.InvitesFromMe(u)
	if err != nil {
		return nil, err
	}
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		friendName := invite.FriendName
		if invite.FriendID == "" {
			friendName = invite.FriendEmail
		}

		friendAvatarLink, err := s.createBlobLink(ctx, invite.FriendAvatarID)
		if err != nil {
			return nil, err
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
	u := s.getUser(ctx)
	invites, err := s.repos.Invite.InvitesForMe(u)
	if err != nil {
		return nil, err
	}
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		userAvatarLink, err := s.createBlobLink(ctx, invite.UserAvatarID)
		if err != nil {
			return nil, err
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
