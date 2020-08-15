package repo

import (
	"database/sql"
	"sort"
	"time"

	"github.com/ansel1/merry"
	"github.com/gofrs/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type MessageHub struct {
	ID            string       `db:"id"`
	Address       string       `db:"address"`
	AdminID       string       `db:"admin_id"`
	AdminName     string       `db:"admin_name"`
	AdminAvatarID string       `db:"admin_avatar_id"`
	CreatedAt     time.Time    `db:"created_at"`
	ApprovedAt    sql.NullTime `db:"approved_at"`
	DisabledAt    sql.NullTime `db:"disabled_at"`
	Details       string       `db:"details"`
	PostLimit     int          `db:"post_limit"`
}

type ConnectedMessageHub struct {
	Hub         MessageHub
	MinDistance int
	Count       int
}

type MessageHubRepo interface {
	HubExists(address string) (bool, error)
	AddHub(address, details string, hubAdmin User, postLimit int) (string, error)
	AllHubs() ([]MessageHub, error)
	Hubs(user User) ([]MessageHub, error)
	Hub(hubID string) (*MessageHub, error)
	ApproveHub(hubID string) error
	RemoveHub(hubID string) error
	ConnectedHubs(user User) ([]ConnectedMessageHub, error)
	SetHubPostLimit(hubAdminID, hubID string, postLimit int) error
	AssignUserToHub(userID, hubID string) error
	UserHubs(userIDs []string) (map[string][]string, error)
}

type messageHubRepo struct {
	db *sqlx.DB
}

var (
	ErrHubNotFound = common.ErrNotFound.WithMessage("hub not found")
)

func NewMessageHubs(db *sqlx.DB) MessageHubRepo {
	return &messageHubRepo{
		db: db,
	}
}

func (r *messageHubRepo) HubExists(address string) (bool, error) {
	var hubID string
	err := r.db.Get(&hubID, `select id from message_hubs where address = $1`,
		address)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return false, nil
		}
		return false, merry.Wrap(err)
	}
	return true, nil
}

func (r *messageHubRepo) AddHub(address, details string, hubAdmin User, postLimit int) (string, error) {
	hubID, err := uuid.NewV4()
	if err != nil {
		return "", merry.Wrap(err)
	}

	if postLimit < 0 {
		postLimit = 0
	}

	_, err = r.db.Exec(`
		insert into message_hubs(id, address, admin_id, created_at, details, post_limit) 
		VALUES ($1, $2, $3, $4, $5, $6)`,
		hubID.String(), address, hubAdmin.ID, common.CurrentTimestamp(), details, postLimit)
	if err != nil {
		return "", merry.Wrap(err)
	}
	return hubID.String(), nil
}

func (r *messageHubRepo) AllHubs() ([]MessageHub, error) {
	var hubs []MessageHub
	err := r.db.Select(&hubs, `
			select h.id, h.address, h.admin_id, h.created_at, h.approved_at, h.disabled_at, h.details,
				   u.name admin_name, u.avatar_thumbnail_id admin_avatar_id, post_limit
			from message_hubs h
				inner join users u on u.id = h.admin_id`)
	for i := range hubs {
		hubs[i].Address = common.CleanPublicURL(hubs[i].Address)
	}
	return hubs, merry.Wrap(err)
}

func (r *messageHubRepo) Hubs(user User) ([]MessageHub, error) {
	var hubs []MessageHub
	err := r.db.Select(&hubs, `
		select h.id, h.address, h.admin_id, h.created_at, h.approved_at, h.disabled_at, h.details,
				   u.name admin_name, u.avatar_thumbnail_id admin_avatar_id, post_limit
		from message_hubs h
			inner join users u on u.id = h.admin_id
		where h.admin_id = $1`, user.ID)
	for i := range hubs {
		hubs[i].Address = common.CleanPublicURL(hubs[i].Address)
	}
	return hubs, merry.Wrap(err)
}

func (r *messageHubRepo) Hub(hubID string) (*MessageHub, error) {
	var hub MessageHub
	err := r.db.Get(&hub, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details, post_limit
		from message_hubs
		where id = $1`, hubID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil, ErrHubNotFound.Here()
		}
		return nil, merry.Wrap(err)
	}

	hub.Address = common.CleanPublicURL(hub.Address)
	return &hub, nil
}

func (r *messageHubRepo) ApproveHub(hubID string) error {
	_, err := r.db.Exec(`
		update message_hubs
		set approved_at = $1
		where id = $2`,
		common.CurrentTimestamp(), hubID)
	return merry.Wrap(err)
}

func (r *messageHubRepo) RemoveHub(hubID string) error {
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
			delete from user_message_hubs
			where hub_id = $1`,
			hubID)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			delete from message_hubs
			where id = $1`,
			hubID)
		return merry.Wrap(err)
	})
}

func (r *messageHubRepo) ConnectedHubs(user User) (connectedHubs []ConnectedMessageHub, err error) {
	type friend struct {
		MinDistance int
		Count       int
	}
	type friendPair struct {
		UserID   string `db:"user_id"`
		FriendID string `db:"friend_id"`
	}
	currentLevel := []string{user.ID}
	nextPairs := make([]friendPair, 0)
	friends := map[string]friend{user.ID: {MinDistance: 0, Count: 1}}
	friendPairs := map[friendPair]struct{}{}
	distance := 0
	for len(currentLevel) > 0 {
		nextPairs = nextPairs[:0]
		distance++
		query, args, err := sqlx.In(`
			select user_id, friend_id
			from friends
			where user_id in (?)`,
			currentLevel)
		if err != nil {
			return nil, merry.Wrap(err)
		}
		query = r.db.Rebind(query)
		err = r.db.Select(&nextPairs, query, args...)
		if err != nil {
			return nil, merry.Wrap(err)
		}

		currentLevel = currentLevel[:0]
		for _, pair := range nextPairs {
			if _, ok := friendPairs[pair]; ok {
				continue
			}
			if _, ok := friendPairs[friendPair{UserID: pair.FriendID, FriendID: pair.UserID}]; ok {
				continue
			}
			friendPairs[pair] = struct{}{}
			if f, ok := friends[pair.FriendID]; !ok {
				friends[pair.FriendID] = friend{MinDistance: distance, Count: 1}
				currentLevel = append(currentLevel, pair.FriendID)
			} else {
				friends[pair.FriendID] = friend{MinDistance: f.MinDistance, Count: f.Count + 1}
			}
		}
	}

	var hubs []MessageHub
	err = r.db.Select(&hubs, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details, post_limit
		from message_hubs
		where approved_at is not null and disabled_at is null`)
	if err != nil {
		return nil, merry.Wrap(err)
	}

	connectedHubs = make([]ConnectedMessageHub, 0, 10)
	for _, hub := range hubs {
		if friend, ok := friends[hub.AdminID]; ok && (hub.PostLimit <= 0 || friend.MinDistance < hub.PostLimit) {
			hub.Address = common.CleanPublicURL(hub.Address)
			connectedHubs = append(connectedHubs, ConnectedMessageHub{
				Hub:         hub,
				MinDistance: friend.MinDistance,
				Count:       friend.Count,
			})
		}
	}

	return connectedHubs, nil
}

func (r *messageHubRepo) SetHubPostLimit(hubAdminID, hubID string, postLimit int) error {
	if postLimit < 0 {
		postLimit = 1
	}

	_, err := r.db.Exec(`
		update message_hubs
		set post_limit = $1
		where id = $2 and admin_id = $3`,
		postLimit, hubID, hubAdminID)
	return merry.Wrap(err)
}

func (r *messageHubRepo) AssignUserToHub(userID, hubID string) error {
	now := common.CurrentTimestamp()
	_, err := r.db.Exec(`
			insert into user_message_hubs(user_id, hub_id, created_at, updated_at)
			values($1, $2, $3, $4)
			on conflict (user_id, hub_id) do update set updated_at = $4;`,
		userID, hubID, now, now)
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}

func (r *messageHubRepo) UserHubs(userIDs []string) (map[string][]string, error) {
	query, args, err := sqlx.In(`
		select umh.user_id, h.address hub_address
		from user_message_hubs umh
			inner join message_hubs h on h.id = umh.hub_id
		where umh.user_id in (?)`, userIDs)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	query = r.db.Rebind(query)
	var hubs []struct {
		UserID     string `db:"user_id"`
		HubAddress string `db:"hub_address"`
	}
	err = r.db.Select(&hubs, query, args...)
	if err != nil {
		return nil, merry.Wrap(err)
	}
	result := make(map[string][]string)
	for _, hub := range hubs {
		result[hub.HubAddress] = append(result[hub.HubAddress], hub.UserID)
	}
	for _, habUserIDs := range result {
		habUserIDs := habUserIDs
		sort.Slice(habUserIDs, func(i, j int) bool {
			return habUserIDs[i] < habUserIDs[j]
		})
	}
	return result, nil
}
