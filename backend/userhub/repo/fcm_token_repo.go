package repo

import (
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type FCMToken struct {
	UserID    string    `db:"user_id"`
	Token     string    `db:"token"`
	DeviceID  string    `db:"device_id"`
	CreatedAt time.Time `db:"created_at"`
}

type FCMTokenRepo interface {
	AddToken(userID, token, deviceID, os string)
	UsersTokens(userIDs []string) []string
	DeleteUserTokens(tx *sqlx.Tx, userID string)
}

func NewFCMToken(db *sqlx.DB) FCMTokenRepo {
	return &fcmTokenRepo{
		db: db,
	}
}

type fcmTokenRepo struct {
	db *sqlx.DB
}

func (r *fcmTokenRepo) AddToken(userID, token, deviceID, os string) {
	_, err := r.db.Exec(`
		insert into fcm_tokens(user_id, token, device_id, os, created_at, updated_at)
		values($1, $2, $3, $4, $5, $5)
		on conflict (user_id, token) do update set device_id = $3, os = $4, updated_at = $5, deleted_at = null;`,
		userID, token, deviceID, os, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
}

func (r *fcmTokenRepo) UsersTokens(userIDs []string) []string {
	if len(userIDs) == 0 {
		return nil
	}

	query, args, err := sqlx.In(`
		select distinct token
		from fcm_tokens
		where user_id in (?) and deleted_at is null;`, userIDs)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)

	var tokens []string
	err = r.db.Select(&tokens, query, args...)
	if err != nil {
		panic(err)
	}
	return tokens
}

func (r *fcmTokenRepo) DeleteUserTokens(tx *sqlx.Tx, userID string) {
	_, err := tx.Exec(`
		delete from fcm_tokens
		where user_id = $1;`,
		userID)
	if err != nil {
		panic(err)
	}
}
