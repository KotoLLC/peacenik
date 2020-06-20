package services

import (
	"context"
	"errors"

	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
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

	friendEmail := r.Friend
	if friend != nil {
		friendEmail = friend.Email
	}

	err = s.repos.Invite.AddInvite(user.ID, friendEmail)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}

	return &rpc.Empty{}, nil
}

func (s *inviteService) Accept(ctx context.Context, r *rpc.InviteAcceptRequest) (*rpc.Empty, error) {
	user := s.getUser(ctx)
	err := s.repos.Invite.AcceptInvite(r.InviterId, user.ID, user.Email)
	if err != nil {
		if errors.Is(err, repo.ErrInviteNotFound) {
			return nil, twirp.NotFoundError(err.Error())
		}
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}
