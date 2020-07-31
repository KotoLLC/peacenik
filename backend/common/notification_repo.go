package common

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/types"
)

type Notification struct {
	ID        string         `db:"id"`
	UserID    string         `db:"user_id"`
	Text      string         `db:"text"`
	Type      string         `db:"type"`
	Data      types.JSONText `db:"data"`
	CreatedAt time.Time      `db:"created_at"`
	ReadAt    sql.NullTime   `db:"read_at"`
}

type NotificationRepo interface {
	AddNotification(userID, text, notificationType string, data map[string]interface{}) error
	Counts(userID string) (total int, unread int, err error)
	Notifications(userID string) ([]Notification, error)
	Clean(userID string, lastKnownID string) error
	MarkRead(userID string, lastKnownID string) error
}

type notificationRepo struct {
	db *sqlx.DB
}

func NewNotifications(db *sqlx.DB) NotificationRepo {
	return &notificationRepo{
		db: db,
	}
}

func (r *notificationRepo) AddNotification(userID, text, notificationType string, data map[string]interface{}) error {
	notificationID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	var jsonData []byte
	if data != nil {
		jsonData, err = json.Marshal(data)
		if err != nil {
			return err
		}
	} else {
		jsonData = []byte("{}")
	}

	_, err = r.db.Exec(`
		insert into notifications(id, user_id, text, type, data, created_at) 
		values ($1, $2, $3, $4, $5, $6)`,
		notificationID, userID, text, notificationType, types.JSONText(jsonData), CurrentTimestamp())
	return err
}

func (r *notificationRepo) Counts(userID string) (total int, unread int, err error) {
	var counters struct {
		Total  int `db:"total"`
		Unread int `db:"unread"`
	}
	err = r.db.Get(&counters, `
		select count(*) total, sum(case when read_at is null then 1 end) unread
		from notifications
		where user_id = $1`,
		userID)
	if err != nil {
		return 0, 0, nil
	}
	return counters.Total, counters.Unread, nil
}

func (r *notificationRepo) Notifications(userID string) ([]Notification, error) {
	var notifications []Notification
	err := r.db.Select(&notifications, `
		select id, user_id, text, type, data, created_at, read_at
		from notifications
		where user_id = $1
		order by created_at`,
		userID)
	if err != nil {
		return nil, err
	}
	return notifications, nil
}

func (r *notificationRepo) Clean(userID string, lastKnownID string) error {
	_, err := r.db.Exec(`
		delete from notifications
		where user_id = $1 and created_at <= (select created_at from notifications where user_id = $1 and id = $2)`,
		userID, lastKnownID)
	return err
}

func (r *notificationRepo) MarkRead(userID string, lastKnownID string) error {
	_, err := r.db.Exec(`
		update notifications
		set read_at = $1
		where user_id = $2 and read_at is null and created_at <= (select created_at from notifications where user_id = $2 and id = $3)`,
		CurrentTimestamp(), userID, lastKnownID)
	return err
}
