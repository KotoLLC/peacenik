package repo

import (
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

var (
	ErrMessageNotFound = errors.New("message not found")
	ErrCommentNotFound = errors.New("comment not found")

	maxTimestamp = time.Date(9999, 12, 31, 23, 59, 59, 999999999, time.Local)
)

type Message struct {
	ID        string    `json:"id" db:"id"`
	UserID    string    `json:"user_id" db:"user_id"`
	UserName  string    `json:"user_name" db:"user_name"`
	Text      string    `json:"text" db:"text"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Comment struct {
	ID        string    `json:"id" db:"id"`
	MessageID string    `json:"message_id" db:"message_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	UserName  string    `json:"user_name" db:"user_name"`
	Text      string    `json:"text" db:"text"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type MessageRepo interface {
	Messages(userIDs []string, from, until time.Time) ([]Message, error)
	Message(messageID string) (Message, error)
	AddMessage(message Message) error
	EditMessage(userID, messageID, text string, updatedAt time.Time) error
	DeleteMessage(userID, messageID string) error
	Comments(messageIDs []string) ([]Comment, error)
	AddComment(comment Comment) error
	EditComment(userID, commentID, text string, updatedAt time.Time) error
	DeleteComment(userID, commentID string) error
	Comment(commentID string) (Comment, error)
}

type messageRepo struct {
	db *sqlx.DB
}

func NewMessages(db *sqlx.DB) MessageRepo {
	return &messageRepo{
		db: db,
	}
}

func (r *messageRepo) Messages(userIDs []string, from, until time.Time) ([]Message, error) {
	if until.IsZero() {
		until = maxTimestamp
	}

	var messages []Message
	query, args, err := sqlx.In(`
		select id, user_id, user_name, text, created_at, updated_at
		from messages
		where user_id in (?)
			and created_at >= ? and created_at < ?
		order by created_at, "id"`, userIDs, from, until)
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

func (r *messageRepo) Message(messageID string) (Message, error) {
	var message Message
	err := r.db.Get(&message, `
		select id, user_id, user_name, text, created_at, updated_at
		from messages
		where id = $1`, messageID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return message, ErrMessageNotFound
		}
		return message, err
	}
	return message, nil
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

func (r *messageRepo) EditMessage(userID, messageID, text string, updatedAt time.Time) error {
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
	return common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
		delete from comments
		where message_id = $1
		  and (select user_id from messages where messages.id = $1) = $2`,
			messageID, userID)
		if err != nil {
			return err
		}

		res, err := tx.Exec(`
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
	})
}

func (r *messageRepo) Comments(messageIDs []string) ([]Comment, error) {
	if len(messageIDs) == 0 {
		return nil, nil
	}

	var comments []Comment
	query, args, err := sqlx.In(`
		select id, message_id, user_id, user_name, text, created_at, updated_at
		from comments
		where message_id in (?)
		order by message_id, created_at`, messageIDs)
	if err != nil {
		return nil, err
	}
	query = r.db.Rebind(query)
	err = r.db.Select(&comments, query, args...)
	if err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *messageRepo) AddComment(comment Comment) error {
	_, err := r.db.Exec(`
		insert into comments(id, message_id, user_id, user_name, text, created_at, updated_at)
		select $1, $2, $3, $4, $5, $6, $7
		where not exists(select * from comments where id = $1)`,
		comment.ID, comment.MessageID, comment.UserID, comment.UserName, comment.Text, comment.CreatedAt, comment.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *messageRepo) EditComment(userID, commentID, text string, updatedAt time.Time) error {
	res, err := r.db.Exec(`
		update comments
		set text = $1, updated_at = $2
		where id = $3 and user_id = $4`,
		text, updatedAt, commentID, userID)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected < 1 {
		return ErrCommentNotFound
	}
	return nil
}

func (r *messageRepo) DeleteComment(userID, commentID string) error {
	res, err := r.db.Exec(`
		delete from comments
		where id = $1 and user_id = $2`,
		commentID, userID)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected < 1 {
		return ErrCommentNotFound
	}

	return nil
}

func (r *messageRepo) Comment(commentID string) (Comment, error) {
	var comment Comment
	err := r.db.Get(&comment, `
		select id, message_id, user_id, user_name, text, created_at, updated_at
		from comments
		where id = $1`, commentID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return comment, ErrCommentNotFound
		}
		return comment, err
	}
	return comment, nil
}
