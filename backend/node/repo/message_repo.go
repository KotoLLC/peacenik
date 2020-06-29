package repo

import (
	"errors"

	"github.com/jmoiron/sqlx"
)

var (
	ErrMessageNotFound = errors.New("message not found")
)

type Message struct {
	ID        string `json:"id" db:"id"`
	UserID    string `json:"user_id" db:"user_id"`
	UserName  string `json:"user_name" db:"user_name"`
	Text      string `json:"text" db:"text"`
	CreatedAt string `json:"created_at" db:"created_at"`
	UpdatedAt string `json:"updated_at" db:"updated_at"`
}

type MessageRepo interface {
	AddMessage(message Message) error
	Messages(userIDs []string) ([]Message, error)
	EditMessage(userID, messageID, text, updatedAt string) error
	DeleteMessage(userID, messageID string) error
}

type messageRepo struct {
	db *sqlx.DB
}

func NewMessages(db *sqlx.DB) MessageRepo {
	return &messageRepo{
		db: db,
	}
}

func (r *messageRepo) AddMessage(message Message) error {
	_, err := r.db.Exec(`
		insert into messages(id, user_id, user_name, text, created_at, updated_at)
		select $1, $2, $3, $4, $5, $6
		where not exists(select * from messages where id = $1)`,
		message.ID, message.UserID, message.UserName, message.Text, message.CreatedAt, message.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *messageRepo) Messages(userIDs []string) ([]Message, error) {
	var messages []Message
	query, args, err := sqlx.In(`
		select id, user_id, user_name, text, created_at, updated_at
		from messages
		where user_id in (?)`, userIDs)
	if err != nil {
		return nil, err
	}
	query = r.db.Rebind(query)
	err = r.db.Select(&messages, query, args...)
	if err != nil {
		return nil, err
	}
	return messages, nil
}

func (r *messageRepo) EditMessage(userID, messageID, text, updatedAt string) error {
	res, err := r.db.Exec(`
		update messages
		set text = $1, updated_at = $2
		where id = $3 and user_id = $4`,
		text, updatedAt, messageID, userID)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected < 1 {
		return ErrMessageNotFound
	}
	return nil
}

func (r *messageRepo) DeleteMessage(userID, messageID string) error {
	res, err := r.db.Exec(`
		delete from messages
		where id = $1 and user_id = $2`,
		messageID, userID)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected < 1 {
		return ErrMessageNotFound
	}
	return nil
}
