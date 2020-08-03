package services_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/twitchtv/twirp"

	"github.com/mreider/koto/backend/central/repo"
	"github.com/mreider/koto/backend/central/rpc"
	"github.com/mreider/koto/backend/central/services"
)

func TestAuthService_Register_EmptyValues(t *testing.T) {
	repos := repo.Repos{
		User: nil,
	}
	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	ctx := context.Background()

	_, err := s.Register(ctx, &rpc.AuthRegisterRequest{
		Name:     "",
		Email:    "user1@mail.org",
		Password: "password1",
	})
	assert.NotNil(t, err)
	twirpErr := err.(twirp.Error)
	assert.Equal(t, twirp.InvalidArgument, twirpErr.Code())
	assert.Equal(t, "name shouldn't be empty", twirpErr.Msg())

	_, err = s.Register(ctx, &rpc.AuthRegisterRequest{
		Name:     "user1",
		Email:    "",
		Password: "password1",
	})
	assert.NotNil(t, err)
	twirpErr = err.(twirp.Error)
	assert.Equal(t, twirp.InvalidArgument, twirpErr.Code())
	assert.Equal(t, "email shouldn't be empty", twirpErr.Msg())

	_, err = s.Register(ctx, &rpc.AuthRegisterRequest{
		Name:     "user1",
		Email:    "user1@mail.org",
		Password: "",
	})
	assert.NotNil(t, err)
	twirpErr = err.(twirp.Error)
	assert.Equal(t, twirp.InvalidArgument, twirpErr.Code())
	assert.Equal(t, "password shouldn't be empty", twirpErr.Msg())
}

func TestAuthService_Register_NameWithSpaces(t *testing.T) {
	repos := repo.Repos{
		User: nil,
	}
	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	ctx := context.Background()

	_, err := s.Register(ctx, &rpc.AuthRegisterRequest{
		Name:     "user\t1",
		Email:    "user1@mail.org",
		Password: "password1",
	})
	assert.NotNil(t, err)
	twirpErr := err.(twirp.Error)
	assert.Equal(t, twirp.InvalidArgument, twirpErr.Code())
	assert.Equal(t, "name is invalid", twirpErr.Msg())
}

func TestAuthService_Register_Duplicated(t *testing.T) {
	te := NewTestEnvironment("auth")
	defer te.Cleanup()

	repos := repo.Repos{
		User: repo.NewUsers(te.db),
	}
	err := repos.User.AddUser("1", "user1", "user1@mail.org", "password1")
	require.Nil(t, err)

	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	_, err = s.Register(te.ctx, &rpc.AuthRegisterRequest{
		Name:     "user1",
		Email:    "user2@mail.org",
		Password: "password1",
	})
	assert.NotNil(t, err)
	twirpErr := err.(twirp.Error)
	assert.Equal(t, twirp.AlreadyExists, twirpErr.Code())
	assert.Equal(t, "user already exists", twirpErr.Msg())

	_, err = s.Register(te.ctx, &rpc.AuthRegisterRequest{
		Name:     "user2",
		Email:    "user1@mail.org",
		Password: "password1",
	})
	assert.NotNil(t, err)
	twirpErr = err.(twirp.Error)
	assert.Equal(t, twirp.AlreadyExists, twirpErr.Code())
	assert.Equal(t, "user already exists", twirpErr.Msg())
}

func TestAuthService_Register(t *testing.T) {
	te := NewTestEnvironment("auth")
	defer te.Cleanup()

	repos := repo.Repos{
		User: repo.NewUsers(te.db),
	}
	err := repos.User.AddUser("1", "user1", "user1@mail.org", "password1")
	require.Nil(t, err)
	userCount, err := repos.User.UserCount()
	require.Nil(t, err)

	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	_, err = s.Register(te.ctx, &rpc.AuthRegisterRequest{
		Name:     "user2",
		Email:    "user2@mail.org",
		Password: "password2",
	})
	assert.Nil(t, err)

	user2, err := repos.User.FindUserByName("user2")
	assert.Nil(t, err)
	assert.NotEmpty(t, user2.ID)
	assert.Equal(t, "user2", user2.Name)
	assert.Equal(t, "user2@mail.org", user2.Email)
	assert.NotEmpty(t, user2.PasswordHash)
	assert.NotEmpty(t, user2.CreatedAt)
	assert.NotEmpty(t, user2.UpdatedAt)

	user2email, err := repos.User.FindUserByEmail("user2@mail.org")
	assert.Nil(t, err)
	assert.Equal(t, user2.ID, user2email.ID)
	assert.Equal(t, user2.Name, user2email.Name)
	assert.Equal(t, user2.Email, user2email.Email)
	assert.Equal(t, user2.PasswordHash, user2email.PasswordHash)
	assert.Equal(t, user2.CreatedAt, user2email.CreatedAt)
	assert.Equal(t, user2.UpdatedAt, user2email.UpdatedAt)

	newUserCount, err := repos.User.UserCount()
	assert.Nil(t, err)
	assert.Equal(t, userCount+1, newUserCount)
}

func TestAuthService_Login(t *testing.T) {
	te := NewTestEnvironment("auth")
	defer te.Cleanup()

	repos := repo.Repos{
		User: repo.NewUsers(te.db),
	}
	err := repos.User.AddUser("1", "user1", "user1@mail.org", "password1-hash")
	require.Nil(t, err)

	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	_, err = s.Login(te.ctx, &rpc.AuthLoginRequest{
		Name:     "user1",
		Password: "password2",
	})
	assert.NotNil(t, err)
	twirpErr := err.(twirp.Error)
	assert.Equal(t, twirp.InvalidArgument, twirpErr.Code())
	assert.Equal(t, "invalid name or password", twirpErr.Msg())

	session := newSession()
	ctx := context.WithValue(te.ctx, services.ContextSession, session)

	_, err = s.Login(ctx, &rpc.AuthLoginRequest{
		Name:     "user1",
		Password: "password1",
	})
	assert.Nil(t, err)
	assert.Equal(t, "1", session.values["session-user-key"])

	session = newSession()
	ctx = context.WithValue(te.ctx, services.ContextSession, session)

	_, err = s.Login(ctx, &rpc.AuthLoginRequest{
		Name:     "user1@mail.org",
		Password: "password1",
	})
	assert.Nil(t, err)
	assert.Equal(t, "1", session.values["session-user-key"])
}

func TestAuthService_Logout(t *testing.T) {
	te := NewTestEnvironment("auth")
	defer te.Cleanup()

	repos := repo.Repos{}

	session := newSession()
	session.values["session-user-key"] = "123"
	ctx := context.WithValue(te.ctx, services.ContextSession, session)

	base := services.NewBase(repos, nil)
	s := services.NewAuth(base, "session-user-key", &passwordHash{}, nil, false)

	_, err := s.Logout(ctx, &rpc.Empty{})
	assert.Nil(t, err)
	assert.Nil(t, err)
	assert.Empty(t, session.values)
}

type passwordHash struct{}

func (h *passwordHash) GenerateHash(password string) (string, error) {
	return password + "-hash", nil
}

func (h *passwordHash) CompareHashAndPassword(hash, password string) bool {
	return hash == password+"-hash"
}

type session struct {
	values map[interface{}]interface{}
}

func newSession() *session {
	return &session{values: make(map[interface{}]interface{})}
}

func (s *session) SetValue(key, value interface{}) {
	s.values[key] = value
}

func (s *session) Clear() {
	s.values = nil
}

func (s *session) Save() error {
	return nil
}
