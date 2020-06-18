package repo

type Repos struct {
	User   UserRepo
	Invite InviteRepo
	Friend FriendRepo
	Node   NodeRepo
}
