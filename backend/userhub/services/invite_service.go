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
	inviteUnregisteredUserEmailBody = `%s
<p>To accept the invitation, click on the link below, register, and visit the friends page:</p>
<p><a href="%s" target="_blank">Click here</a>.</p><p>Thanks!</p>`

	invitationsFrontendPath       = "/friends/invitations"
	inviteRegisteredUserEmailBody = `%s
<p>To accept the invitation, click on the link below, log in, and visit the friends page:</p>
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

	friend := s.repos.User.FindUserByIDOrName(r.Friend)
	if friend == nil {
		if strings.Contains(r.Friend, "@") && strings.Contains(r.Friend, ".") {
			friends := s.repos.User.FindUsersByEmail(r.Friend)
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
		areBlocked := s.repos.User.AreBlocked(user.ID, friend.ID)
		if areBlocked {
			return nil, twirp.NotFoundError("user not found")
		}

		if s.repos.Friend.AreFriends(user.ID, friend.ID) {
			return nil, twirp.NewError(twirp.AlreadyExists, "already a friend.")
		}

		s.repos.Invite.AddInvite(user.ID, friend.ID)
		s.notificationSender.SendNotification([]string{friend.ID}, user.DisplayName()+" invited you to be friends", "invite/add", map[string]interface{}{
			"user_id": user.ID,
		})
		err := s.sendInviteLinkToRegisteredUser(ctx, user, friend.Email)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	} else {
		s.repos.Invite.AddInviteByEmail(user.ID, r.Friend)
		err := s.sendInviteLinkToUnregisteredUser(ctx, user, r.Friend)
		if err != nil {
			log.Println("can't invite by email:", err)
		}
	}

	return &rpc.Empty{}, nil
}

func (s *inviteService) Accept(ctx context.Context, r *rpc.InviteAcceptRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if !s.repos.Invite.AcceptInvite(r.InviterId, user.ID, false) {
		return nil, twirp.NotFoundError("invite not found")
	}
	s.notificationSender.SendNotification([]string{r.InviterId}, user.DisplayName()+" accepted your invite!", "invite/accept", map[string]interface{}{
		"user_id": user.ID,
	})
	return &rpc.Empty{}, nil
}

func (s *inviteService) Reject(ctx context.Context, r *rpc.InviteRejectRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	if !s.repos.Invite.RejectInvite(r.InviterId, user.ID) {
		return nil, twirp.NotFoundError("invite not found")
	}
	s.notificationSender.SendNotification([]string{r.InviterId}, user.DisplayName()+" rejected your invite", "invite/reject", map[string]interface{}{
		"user_id": user.ID,
	})
	return &rpc.Empty{}, nil
}

func (s *inviteService) FromMe(ctx context.Context, _ *rpc.Empty) (*rpc.InviteFromMeResponse, error) {
	user := s.getUser(ctx)
	invites := s.repos.Invite.InvitesFromMe(user)
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		friendName, friendFullName := invite.FriendName, invite.FriendFullName
		if invite.FriendID == "" {
			friendName = invite.FriendEmail
			friendFullName = ""
		}

		friendAvatarLink, err := s.createBlobLink(ctx, invite.FriendAvatarID)
		if err != nil {
			return nil, err
		}

		rpcInvites[i] = &rpc.InviteFriendInvite{
			FriendId:       invite.FriendID,
			FriendName:     friendName,
			FriendFullName: friendFullName,
			FriendAvatar:   friendAvatarLink,
			CreatedAt:      common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:     common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:     common.NullTimeToRPCString(invite.RejectedAt),
		}
	}

	return &rpc.InviteFromMeResponse{
		Invites: rpcInvites,
	}, nil
}

func (s *inviteService) ForMe(ctx context.Context, _ *rpc.Empty) (*rpc.InviteForMeResponse, error) {
	user := s.getUser(ctx)
	invites := s.repos.Invite.InvitesForMe(user)
	rpcInvites := make([]*rpc.InviteFriendInvite, len(invites))
	for i, invite := range invites {
		userAvatarLink, err := s.createBlobLink(ctx, invite.UserAvatarID)
		if err != nil {
			return nil, err
		}

		rpcInvites[i] = &rpc.InviteFriendInvite{
			FriendId:       invite.UserID,
			FriendName:     invite.UserName,
			FriendFullName: invite.UserFullName,
			FriendAvatar:   userAvatarLink,
			CreatedAt:      common.TimeToRPCString(invite.CreatedAt),
			AcceptedAt:     common.NullTimeToRPCString(invite.AcceptedAt),
			RejectedAt:     common.NullTimeToRPCString(invite.RejectedAt),
		}
	}

	return &rpc.InviteForMeResponse{
		Invites: rpcInvites,
	}, nil
}

func (s *inviteService) sendInviteLinkToUnregisteredUser(ctx context.Context, inviter repo.User, userEmail string) error {
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

	attachments := s.GetUserAttachments(ctx, inviter)

	link := fmt.Sprintf("%s"+registerFrontendPath, s.cfg.FrontendAddress, url.QueryEscape(userEmail), inviteToken)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviter.DisplayName()+" invited you to be friends on KOTO",
		fmt.Sprintf(inviteUnregisteredUserEmailBody, attachments.InlineHTML("avatar"), link),
		attachments)
}

func (s *inviteService) sendInviteLinkToRegisteredUser(ctx context.Context, inviter repo.User, userEmail string) error {
	if !s.mailSender.Enabled() {
		return nil
	}

	attachments := s.GetUserAttachments(ctx, inviter)

	link := fmt.Sprintf("%s"+invitationsFrontendPath, s.cfg.FrontendAddress)
	return s.mailSender.SendHTMLEmail([]string{userEmail}, inviter.DisplayName()+" invited you to be friends on KOTO",
		fmt.Sprintf(inviteRegisteredUserEmailBody, attachments.InlineHTML("avatar"), link),
		attachments)
}
