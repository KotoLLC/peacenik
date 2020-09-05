package services

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/ansel1/merry"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/rpc"
)

const (
	registerFrontendPath            = "/registration?email=%s&invite=%s"
	inviteUnregisteredUserEmailBody = `<p>To accept the invitation, click on the link below, register, and visit the friends page:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	invitationsFrontendPath       = "/friends/invitations"
	inviteRegisteredUserEmailBody = `<p>To accept the invitation, click on the link below, log in, and visit the friends page:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`
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

	friend, err := s.repos.User.FindUserByIDOrName(r.Friend)
	if err != nil {
		return nil, err
	}

	if friend == nil {
		if strings.Contains(r.Friend, "@") && strings.Contains(r.Friend, ".") {
			friends, err := s.repos.User.FindUsersByEmail(r.Friend)
			if err != nil {
				return nil, err
			}
			if len(friends) == 1 {
				friend = &friends[0]
			} else if len(friends) > 1 {
				return nil, twirp.NewError(twirp.AlreadyExists, "Email belongs to more than one account. Invite by username instead.")
			}
		} else {
			return nil, twirp.NotFoundError("user not found")
		}
	}

	if friend != nil {
		alreadyFriends, err := s.repos.Friend.AreFriends(user, *friend)
		if err != nil {
			return nil, err
		}
		if alreadyFriends {
			return nil, twirp.NewError(twirp.AlreadyExists, "already a friend.")
		}

		err = s.repos.Invite.AddInvite(user.ID, friend.ID)
		if err != nil {
			return nil, err
		}
		err = s.repos.Notification.AddNotification(friend.ID, user.Name+" invited you to be friends", "invite/add", map[string]interface{}{
			"user_id": user.ID,
		})
		if err != nil {
			log.Println(err)
		}
		err = s.sendInviteLinkToRegisteredUser(user, friend.Email)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	} else {
		err = s.repos.Invite.AddInviteByEmail(user.ID, r.Friend)
		if err != nil {
			return nil, err
		}

		err = s.sendInviteLinkToUnregisteredUser(user, r.Friend)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *inviteService) Accept(ctx context.Context, r *rpc.InviteAcceptRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Invite.AcceptInvite(r.InviterId, user.ID, false)
	if err != nil {
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
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
		if merry.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, err
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
	user := s.getUser(ctx)
	invites, err := s.repos.Invite.InvitesForMe(user)
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

func (s *inviteService) sendInviteLinkToUnregisteredUser(inviter repo.User, userEmail string) error {
	if !s.mailSender.Enabled() {
		return nil
	}

	inviteToken, err := s.tokenGenerator.Generate(inviter.ID, inviter.Name, "user-invite",
		time.Now().Add(time.Hour*24*30*12),
		map[string]interface{}{
			"email": userEmail,
		})
	if err != nil {
		return merry.Wrap(err)
	}

	link := fmt.Sprintf("%s"+registerFrontendPath, s.frontendAddress, url.QueryEscape(userEmail), inviteToken)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviter.Name+" invited you to be friends on KOTO", fmt.Sprintf(inviteUnregisteredUserEmailBody, link))
}

func (s *inviteService) sendInviteLinkToRegisteredUser(inviter repo.User, userEmail string) error {
	if !s.mailSender.Enabled() {
		return nil
	}

	link := fmt.Sprintf("%s"+invitationsFrontendPath, s.frontendAddress)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviter.Name+" invited you to be friends on KOTO", fmt.Sprintf(inviteRegisteredUserEmailBody, link))
}
