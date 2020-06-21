package services

type ContextKey string

const (
	ContextUserKey    ContextKey = "user"
	ContextIsAdminKey ContextKey = "isAdmin"
	ContextSession    ContextKey = "session"
)

type Session interface {
	SetValue(key, value interface{})
	Clear()
	Save() error
}
