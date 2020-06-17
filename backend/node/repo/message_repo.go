package repo

import (
	"github.com/jmoiron/sqlx"
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
}

type messageRepo struct {
	db *sqlx.DB
}

func NewMessages(db *sqlx.DB) MessageRepo {
	return &messageRepo{
		db: db,
	}
}

func (mr *messageRepo) AddMessage(message Message) error {
	_, err := mr.db.Exec(`
		insert into messages(id, user_id, user_name, text, created_at, updated_at)
		select $1, $2, $3, $4, $5, $6
		where not exists(select * from messages where id = $1)`,
		message.ID, message.UserID, message.UserName, message.Text, message.CreatedAt, message.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (mr *messageRepo) Messages(userIDs []string) ([]Message, error) {
	var messages []Message
	query, args, err := sqlx.In(`
		select id, user_id, user_name, text, created_at, updated_at
		from messages
		where user_id in (?)`, userIDs)
	if err != nil {
		return nil, err
	}
	query = mr.db.Rebind(query)
	err = mr.db.Select(&messages, query, args...)
	if err != nil {
		return nil, err
	}
	return messages, nil
}
