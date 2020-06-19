package services

type ContextKey string

const (
	ContextUserKey ContextKey = "user"
	ContextSession ContextKey = "session"
)

type Session interface {
	SetValue(key, value interface{})
	Clear()
	Save() error
}
