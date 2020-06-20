package services

import (
	"context"
	"strings"
	"unicode"

	"github.com/gofrs/uuid"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/rpc"
)

type PasswordHash interface {
	GenerateHash(password string) (string, error)
	CompareHashAndPassword(hash, password string) bool
}

type authService struct {
	*BaseService
	sessionUserKey string
	passwordHash   PasswordHash
}

func NewAuth(base *BaseService, sessionUserKey string, passwordHash PasswordHash) rpc.AuthService {
	return &authService{
		BaseService:    base,
		sessionUserKey: sessionUserKey,
		passwordHash:   passwordHash,
	}
}

func (s *authService) Register(_ context.Context, r *rpc.AuthRegisterRequest) (*rpc.Empty, error) {
	if r.Name == "" {
		return nil, twirp.InvalidArgumentError("name", "shouldn't be empty")
	}
	if r.Email == "" {
		return nil, twirp.InvalidArgumentError("email", "shouldn't be empty")
	}
	if r.Password == "" {
		return nil, twirp.InvalidArgumentError("password", "shouldn't be empty")
	}
	if strings.IndexFunc(r.Name, unicode.IsSpace) >= 0 {
		return nil, twirp.InvalidArgumentError("name", "shouldn't contain spaces")
	}

	user, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	user, err = s.repos.User.FindUserByEmail(r.Email)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	if user != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	userID, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	passwordHash, err := s.passwordHash.GenerateHash(r.Password)
	if err != nil {
		return nil, err
	}

	err = s.repos.User.AddUser(userID.String(), r.Name, r.Email, passwordHash)
	if err != nil {
		return nil, err
	}

	return &rpc.Empty{}, nil
}

func (s *authService) Login(ctx context.Context, r *rpc.AuthLoginRequest) (*rpc.Empty, error) {
	user, err := s.repos.User.FindUserByNameOrEmail(r.Name)
	if err != nil {
		return nil, twirp.InternalErrorWith(err)
	}
	if user == nil {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid name or password")
	}

	if !s.passwordHash.CompareHashAndPassword(user.PasswordHash, r.Password) {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid name or password")
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
