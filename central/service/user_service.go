package service

import (
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/mreider/koto/central/repo"
	"github.com/mreider/koto/central/token"
)

type UserService interface {
	Register(name, email, password string) error
	Login(email, password string) (user *repo.User, err error)
	Token(user repo.User) (token string, err error)
}

type userService struct {
	users          repo.UserRepo
	tokenGenerator token.Generator
}

func NewUser(users repo.UserRepo, tokenGenerator token.Generator) UserService {
	return &userService{
		users:          users,
		tokenGenerator: tokenGenerator,
	}
}

func (s *userService) Register(name, email, password string) error {
	user, err := s.users.FindUserByEmail(email)
	if err != nil {
		return err
	}
	if user != nil {
		return ErrUserAlreadyExists
	}

	user, err = s.users.FindUserByName(name)
	if err != nil {
		return err
	}
	if user != nil {
		return ErrUserAlreadyExists
	}

	userID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	err = s.users.AddUser(userID.String(), name, email, string(passwordHash))
	if err != nil {
		return err
	}

	return nil
}

func (s *userService) Login(email, password string) (user *repo.User, err error) {
	user, err = s.users.FindUserByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserInvalidEmailOrPassword
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, ErrUserInvalidEmailOrPassword
	}
	return user, nil
}

func (s *userService) Token(user repo.User) (token string, err error) {
	return s.tokenGenerator.Generate(user, "auth", time.Now().Add(time.Minute*10), nil)
}
