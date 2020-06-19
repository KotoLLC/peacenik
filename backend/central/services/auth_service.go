package services

import (
	"context"

	"github.com/gofrs/uuid"
	"github.com/twitchtv/twirp"
	"golang.org/x/crypto/bcrypt"

	"github.com/mreider/koto/backend/central/rpc"
)

type authService struct {
	*BaseService
	sessionUserKey string
}

func NewAuth(base *BaseService, sessionUserKey string) rpc.AuthService {
	return &authService{
		BaseService:    base,
		sessionUserKey: sessionUserKey,
	}
}

func (s *authService) Register(_ context.Context, r *rpc.AuthRegisterRequest) (*rpc.Empty, error) {
	user, err := s.repos.User.FindUserByEmail(r.Email)
	if err != nil {
		return nil, err
	}
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	user, err = s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	userID, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(r.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	err = s.repos.User.AddUser(userID.String(), r.Name, r.Email, string(passwordHash))
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *authService) Login(ctx context.Context, r *rpc.AuthLoginRequest) (*rpc.Empty, error) {
	user, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if user == nil {
		user, err = s.repos.User.FindUserByEmail(r.Name)
		if err != nil {
			return nil, err
		}
	}

	if user == nil {
		return nil, twirp.InvalidArgumentError("", "invalid name or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(r.Password))
	if err != nil {
		return nil, twirp.InvalidArgumentError("", "invalid name or password")
	}

	session := s.getAuthSession(ctx)
	session.SetValue(s.sessionUserKey, user.ID)
	err = session.Save()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Logout(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	session := s.getAuthSession(ctx)
	session.Clear()
	err := session.Save()
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	return &rpc.Empty{}, nil
}

func (s *authService) getAuthSession(ctx context.Context) Session {
	session, _ := ctx.Value(ContextSession).(Session)
	return session
}
