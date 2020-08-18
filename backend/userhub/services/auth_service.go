package services

import (
	"context"
	"log"
	"regexp"
	"strings"

	"github.com/ansel1/merry"
	"github.com/gofrs/uuid"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/userhub/rpc"
	"github.com/mreider/koto/backend/userhub/services/user"
)

var (
	userNameRe = regexp.MustCompile(`^\w(\w|-|_|\.)+\w$`)
)

type PasswordHash interface {
	GenerateHash(password string) (string, error)
	CompareHashAndPassword(hash, password string) bool
}

type authService struct {
	*BaseService
	sessionUserKey   string
	passwordHash     PasswordHash
	userConfirmation *user.Confirmation
	testMode         bool
}

func NewAuth(base *BaseService, sessionUserKey string, passwordHash PasswordHash, userConfirmation *user.Confirmation, testMode bool) rpc.AuthService {
	return &authService{
		BaseService:      base,
		sessionUserKey:   sessionUserKey,
		passwordHash:     passwordHash,
		userConfirmation: userConfirmation,
		testMode:         testMode,
	}
}

func (s *authService) Register(_ context.Context, r *rpc.AuthRegisterRequest) (*rpc.Empty, error) {
	if r.Name == "" {
		return nil, twirp.InvalidArgumentError("username", "shouldn't be empty")
	}
	if r.Email == "" {
		return nil, twirp.InvalidArgumentError("email", "shouldn't be empty")
	}
	if r.Password == "" {
		return nil, twirp.InvalidArgumentError("password", "shouldn't be empty")
	}
	r.Name = strings.TrimSpace(r.Name)
	if !userNameRe.MatchString(r.Name) {
		return nil, twirp.InvalidArgumentError("username", "is invalid")
	}

	u, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if u != nil {
		return nil, twirp.NewError(twirp.AlreadyExists, "user already exists")
	}

	userID, err := uuid.NewV4()
	if err != nil {
		return nil, merry.Wrap(err)
	}

	passwordHash, err := s.passwordHash.GenerateHash(r.Password)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	err = s.repos.User.AddUser(userID.String(), r.Name, r.Email, passwordHash)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	u, err = s.repos.User.FindUserByID(userID.String())
	if err != nil {
		return nil, merry.Wrap(err)
	}
	if u == nil {
		return nil, twirp.NotFoundError("user not found")
	}
	if s.userConfirmation != nil {
		if r.InviteToken == "" {
			err := s.userConfirmation.SendConfirmLink(*u)
			if err != nil {
				log.Printf("can't send email to %s: %s\n", u.Email, err)
			}
		} else {
			err := s.userConfirmation.ConfirmInviteToken(*u, r.InviteToken)
			if err != nil {
				log.Printf("can't confirm invite token for %s: %s\n", u.Email, err)
			}
		}
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Login(ctx context.Context, r *rpc.AuthLoginRequest) (*rpc.Empty, error) {
	u, err := s.repos.User.FindUserByName(r.Name)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid username or password")
	}

	if !s.passwordHash.CompareHashAndPassword(u.PasswordHash, r.Password) {
		return nil, twirp.NewError(twirp.InvalidArgument, "invalid username or password")
	}

	session := s.getAuthSession(ctx)
	session.SetValue(s.sessionUserKey, u.ID)
	err = session.Save()
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) Logout(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	session := s.getAuthSession(ctx)
	session.Clear()
	err := session.Save()
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) getAuthSession(ctx context.Context) Session {
	session, _ := ctx.Value(ContextSession).(Session)
	return session
}

func (s *authService) Confirm(ctx context.Context, r *rpc.AuthConfirmRequest) (*rpc.Empty, error) {
	if s.testMode {
		if s.isAdmin(ctx) {
			u, err := s.repos.User.FindUserByIDOrName(r.Token)
			if err != nil {
				return nil, err
			}
			if u != nil {
				err = s.repos.User.ConfirmUser(u.ID)
				if err != nil {
					return nil, err
				}
				return &rpc.Empty{}, nil
			}
		}
	}

	err := s.userConfirmation.Confirm(r.Token)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}

func (s *authService) SendConfirmLink(ctx context.Context, _ *rpc.Empty) (*rpc.Empty, error) {
	if !s.hasUser(ctx) {
		return nil, twirp.NewError(twirp.Unauthenticated, "")
	}
	u := s.getUser(ctx)
	err := s.userConfirmation.SendConfirmLink(u)
	if err != nil {
		return nil, err
	}
	return &rpc.Empty{}, nil
}
