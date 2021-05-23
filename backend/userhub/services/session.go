package services

import (
	"time"
)

type ContextKey string

const (
	ContextUserKey    ContextKey = "user"
	ContextIsAdminKey ContextKey = "isAdmin"
	ContextSession    ContextKey = "session"
	ContextHubKey     ContextKey = "hub"
)

type SessionSaveOptions struct {
	MaxAge time.Duration
}

type Session interface {
	SetValue(key, value interface{})
	Clear()
	Save(options SessionSaveOptions) error
}
