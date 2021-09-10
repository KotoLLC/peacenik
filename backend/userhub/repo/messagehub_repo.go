package repo

import (
	"database/sql"
	"sort"
	"time"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

const (
	GuestHubDistance = 1_000_000
)

type MessageHub struct {
	ID                string       `db:"id"`
	Address           string       `db:"address"`
	AdminID           string       `db:"admin_id"`
	CreatedAt         time.Time    `db:"created_at"`
	ApprovedAt        sql.NullTime `db:"approved_at"`
	DisabledAt        sql.NullTime `db:"disabled_at"`
	Details           string       `db:"details"`
	PostLimit         int          `db:"post_limit"`
	AllowFriendGroups bool         `db:"allow_friend_groups"`
	ExpirationDays    int          `db:"expiration_days"`
}

type ConnectedMessageHub struct {
	Hub         MessageHub
	MinDistance int
	Count       int
}

type MessageHubRepo interface {
	HubExists(address string) bool
	AddHub(address, details string, hubAdminID string, postLimit int, allowFriendGroups bool) string
	AllHubs() []MessageHub
	Hubs(user User) []MessageHub
	HubByID(hubID string) *MessageHub
	HubByIDOrAddress(hubID string) *MessageHub
	ApproveHub(hubID string)
	RemoveHub(hubID string)
	ConnectedHubs(user User) []ConnectedMessageHub
	SetHubPostLimit(hubAdminID, hubID string, postLimit int)
	SetHubAllowFriendGroups(hubAdminID, hubID string, allowFriendGroups bool)
	SetHubExpirationDays(hubAdminID, hubID string, expirationDays int)
	AssignUserToHub(userID, hubID string, minDistance int)
	SetUserPublic(userID, hubID string, isPublic bool)
	UserHubs(userIDs []string, forPublicMessages bool) map[string][]string
	GroupHub(groupAdminID string) string
	BlockUser(userID, hubID string)
	DeleteUserData(tx *sqlx.Tx, userID string)
}

func NewMessageHubs(db *sqlx.DB) MessageHubRepo {
	return &messageHubRepo{
		db: db,
	}
}

type messageHubRepo struct {
	db *sqlx.DB
}

func (r *messageHubRepo) HubExists(address string) bool {
	var hubID string
	err := r.db.Get(&hubID, `select id from message_hubs where address = $1`,
		address)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return false
		}
		panic(err)
	}
	return true
}

func (r *messageHubRepo) AddHub(address, details string, hubAdminID string, postLimit int, allowFriendGroups bool) string {
	hubID := common.GenerateUUID()
	if postLimit < 0 {
		postLimit = 0
	}

	_, err := r.db.Exec(`
		insert into message_hubs(id, address, admin_id, created_at, details, post_limit, allow_friend_groups) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		hubID, address, hubAdminID, common.CurrentTimestamp(), details, postLimit, allowFriendGroups)
	if err != nil {
		panic(err)
	}
	return hubID
}

func (r *messageHubRepo) AllHubs() []MessageHub {
	var hubs []MessageHub
	err := r.db.Select(&hubs, `
		select h.id, h.address, h.admin_id, h.created_at, h.approved_at, h.disabled_at, h.details,
			   h.post_limit, h.allow_friend_groups, h.expiration_days
		from message_hubs h;`)
	if err != nil {
		panic(err)
	}
	return hubs
}

func (r *messageHubRepo) Hubs(user User) []MessageHub {
	var hubs []MessageHub
	err := r.db.Select(&hubs, `
		select h.id, h.address, h.admin_id, h.created_at, h.approved_at, h.disabled_at, h.details,
		       h.post_limit, h.allow_friend_groups, h.expiration_days
		from message_hubs h
		where h.admin_id = $1`, user.ID)
	if err != nil {
		panic(err)
	}
	return hubs
}

func (r *messageHubRepo) HubByID(hubID string) *MessageHub {
	var hub MessageHub
	err := r.db.Get(&hub, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details, post_limit, allow_friend_groups, expiration_days
		from message_hubs
		where id = $1`, hubID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &hub
}

func (r *messageHubRepo) HubByIDOrAddress(hubID string) *MessageHub {
	var hub MessageHub
	err := r.db.Get(&hub, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details, post_limit, allow_friend_groups, expiration_days
		from message_hubs
		where id = $1 or address = $1`, hubID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &hub
}

func (r *messageHubRepo) ApproveHub(hubID string) {
	_, err := r.db.Exec(`
		update message_hubs
		set approved_at = $1
		where id = $2`,
		common.CurrentTimestamp(), hubID)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) RemoveHub(hubID string) {
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
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
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) ConnectedHubs(user User) []ConnectedMessageHub {
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
			panic(err)
		}
		query = r.db.Rebind(query)
		err = r.db.Select(&nextPairs, query, args...)
		if err != nil {
			panic(err)
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
	err := r.db.Select(&hubs, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details, post_limit, allow_friend_groups, expiration_days
		from message_hubs mh
		where approved_at is not null and disabled_at is null
		  and not exists(select * from user_message_hubs where hub_id = mh.id and user_id = $1 and blocked_at is not null);`,
		user.ID)
	if err != nil {
		panic(err)
	}

	connectedHubs := make([]ConnectedMessageHub, 0, 10)
	for _, hub := range hubs {
		if friend, ok := friends[hub.AdminID]; ok && (hub.PostLimit <= 0 || friend.MinDistance < hub.PostLimit) {
			connectedHubs = append(connectedHubs, ConnectedMessageHub{
				Hub:         hub,
				MinDistance: friend.MinDistance,
				Count:       friend.Count,
			})
		} else if hub.PostLimit == 0 {
			connectedHubs = append(connectedHubs, ConnectedMessageHub{
				Hub:         hub,
				MinDistance: GuestHubDistance,
				Count:       0,
			})
		}
	}

	sort.Slice(connectedHubs, func(i, j int) bool {
		if connectedHubs[i].MinDistance < connectedHubs[j].MinDistance {
			return true
		}
		if connectedHubs[j].MinDistance < connectedHubs[i].MinDistance {
			return false
		}

		if connectedHubs[i].Count < connectedHubs[j].Count {
			return true
		}
		if connectedHubs[j].Count < connectedHubs[i].Count {
			return false
		}

		if connectedHubs[j].Hub.ApprovedAt.Time.Before(connectedHubs[i].Hub.ApprovedAt.Time) {
			return true
		}
		if connectedHubs[i].Hub.ApprovedAt.Time.Before(connectedHubs[j].Hub.ApprovedAt.Time) {
			return false
		}

		return connectedHubs[i].Hub.Address < connectedHubs[j].Hub.Address
	})

	return connectedHubs
}

func (r *messageHubRepo) SetHubPostLimit(hubAdminID, hubID string, postLimit int) {
	if postLimit < 0 {
		postLimit = 1
	}

	_, err := r.db.Exec(`
		update message_hubs
		set post_limit = $1
		where id = $2 and admin_id = $3`,
		postLimit, hubID, hubAdminID)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) SetHubAllowFriendGroups(hubAdminID, hubID string, allowFriendGroups bool) {
	_, err := r.db.Exec(`
		update message_hubs
		set allow_friend_groups = $1
		where id = $2 and admin_id = $3`,
		allowFriendGroups, hubID, hubAdminID)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) SetHubExpirationDays(hubAdminID, hubID string, expirationDays int) {
	if expirationDays < 0 {
		expirationDays = 0
	}

	_, err := r.db.Exec(`
		update message_hubs
		set expiration_days = $1
		where id = $2 and admin_id = $3`,
		expirationDays, hubID, hubAdminID)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) AssignUserToHub(userID, hubID string, minDistance int) {
	now := common.CurrentTimestamp()
	_, err := r.db.Exec(`
		insert into user_message_hubs(user_id, hub_id, created_at, updated_at, min_distance)
		values($1, $2, $3, $4, $5)
		on conflict (user_id, hub_id) do update set updated_at = $4, min_distance = $5;`,
		userID, hubID, now, now, minDistance)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) SetUserPublic(userID, hubID string, isPublic bool) {
	var publicAt sql.NullTime
	if isPublic {
		now := common.CurrentTimestamp()
		publicAt = sql.NullTime{Time: now, Valid: true}
	}
	_, err := r.db.Exec(`
		update user_message_hubs
		set public_at = $1
		where user_id = $2 and hub_id = $3;`,
		publicAt, userID, hubID)
	if err != nil {
		panic(err)
	}
}

func (r *messageHubRepo) UserHubs(userIDs []string, forPublicMessages bool) map[string][]string {
	if len(userIDs) == 0 {
		return nil
	}

	var query string
	var args []interface{}
	var err error
	if !forPublicMessages {
		query, args, err = sqlx.In(`
		select umh.user_id, h.address hub_address
		from user_message_hubs umh
			inner join message_hubs h on h.id = umh.hub_id
		where umh.user_id in (?) and umh.blocked_at is null and h.approved_at is not null
		union all
		select admin_id, address hub_address
		from message_hubs
		where admin_id in (?) and approved_at is not null;`,
			userIDs, userIDs)
	} else {
		query, args, err = sqlx.In(`
		select umh.user_id, h.address hub_address
		from user_message_hubs umh
			inner join message_hubs h on h.id = umh.hub_id
		where umh.user_id in (?) and umh.blocked_at is null and h.approved_at is not null and umh.public_at is not null
		union all
		select admin_id, address hub_address
		from message_hubs
		where admin_id in (?) and approved_at is not null;`,
			userIDs, userIDs)
	}
	if err != nil {
		panic(err)
	}

	query = r.db.Rebind(query)
	var hubs []struct {
		UserID     string `db:"user_id"`
		HubAddress string `db:"hub_address"`
	}
	err = r.db.Select(&hubs, query, args...)
	if err != nil {
		panic(err)
	}
	result := make(map[string][]string)
	for _, hub := range hubs {
		result[hub.HubAddress] = append(result[hub.HubAddress], hub.UserID)
	}
	for _, hubUserIDs := range result {
		hubUserIDs := hubUserIDs
		sort.Slice(hubUserIDs, func(i, j int) bool {
			return hubUserIDs[i] < hubUserIDs[j]
		})
	}
	return result
}

func (r *messageHubRepo) GroupHub(groupAdminID string) string {
	var hubAddress string
	err := r.db.Get(&hubAddress, `
		select h.address
		from user_message_hubs umh
			inner join message_hubs h on h.id = umh.hub_id
		where umh.user_id = $1 and umh.blocked_at is null
		    and h.approved_at is not null
			and (h.admin_id = $1
				or (h.allow_friend_groups = true and exists(select * from friends f where f.user_id = $1 and f.friend_id = h.admin_id)))
		order by case when h.admin_id = $1 then 0 else 1 end, umh.updated_at desc
		limit 1;`,
		groupAdminID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			err := r.db.Get(&hubAddress, `
				select address
				from message_hubs
				where admin_id = $1 and approved_at is not null
				order by approved_at desc
				limit 1;`,
				groupAdminID)
			if err != nil {
				if merry.Is(err, sql.ErrNoRows) {
					return ""
				}
				panic(err)
			}
		} else {
			panic(err)
		}
	}
	return hubAddress
}

func (r *messageHubRepo) BlockUser(userID, hubID string) {
	now := common.CurrentTimestamp()
	var blockedAt sql.NullString
	err := r.db.Get(&blockedAt, `select blocked_at from user_message_hubs where hub_id = $1 and user_id = $2`,
		hubID, userID)
	if err != nil && !merry.Is(err, sql.ErrNoRows) {
		panic(err)
	}
	if merry.Is(err, sql.ErrNoRows) {
		_, err := r.db.Exec(`
			insert into user_message_hubs(user_id, hub_id, created_at, updated_at, blocked_at)
			values($1, $2, $3, $3, $3)
			on conflict (user_id, hub_id) do update set blocked_at = $3;`,
			userID, hubID, now)
		if err != nil {
			panic(err)
		}
	} else if !blockedAt.Valid {
		_, err := r.db.Exec(`
			update user_message_hubs
			set blocked_at = $1
			where hub_id = $2 and user_id = $3;`,
			now, hubID, userID)
		if err != nil {
			panic(err)
		}
	}
}

func (r *messageHubRepo) DeleteUserData(tx *sqlx.Tx, userID string) {
	_, err := tx.Exec(`
		delete from user_message_hubs
		where user_id = $1
		   or hub_id in (select id from message_hubs where admin_id = $1);`,
		userID)
	if err != nil {
		panic(err)
	}
	_, err = tx.Exec(`
		delete from message_hubs
		where admin_id = $1;`,
		userID)
	if err != nil {
		panic(err)
	}
}
