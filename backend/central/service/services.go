package service

type Services struct {
	User   UserService
	Invite InviteService
	Node   NodeService
}

type Session interface {
	SetValue(key, value interface{})
	Clear()
	Save() error
}
