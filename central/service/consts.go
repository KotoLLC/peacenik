package service

import (
	"errors"
)

type ContextKey string

const (
	ContextUserKey ContextKey = "user"
)

var (
	ErrUserAlreadyExists          = errors.New("user already exists")
	ErrUserNotFound               = errors.New("user not found")
	ErrUserInvalidEmailOrPassword = errors.New("invalid email or password")
)
