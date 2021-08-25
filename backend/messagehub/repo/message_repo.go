package repo

import (
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

var (
	maxTimestamp        = time.Date(9999, 12, 31, 23, 59, 59, 999999999, time.Local)
	defaultMessageCount = 10
)

type Message struct {
	ID                    string         `json:"id" db:"id"`
	ParentID              sql.NullString `json:"parent_id" db:"parent_id"`
	UserID                string         `json:"user_id" db:"user_id"`
	Text                  string         `json:"text" db:"text"`
	AttachmentID          string         `json:"attachment_id" db:"attachment_id"`
	AttachmentType        string         `json:"attachment_type" db:"attachment_type"`
	AttachmentThumbnailID string         `json:"attachment_thumbnail_id" db:"attachment_thumbnail_id"`
	CreatedAt             time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt             time.Time      `json:"updated_at" db:"updated_at"`
	Likes                 int            `json:"likes" db:"likes"`
	LikedByMe             bool           `json:"liked_by_me" db:"liked_by_me"`
	GroupID               sql.NullString `json:"group_id" db:"group_id"`
	IsGuest               bool           `json:"is_guest" db:"is_guest"`
	FriendID              sql.NullString `json:"friend_id" db:"friend_id"`
	IsPublic              bool           `json:"is_public" db:"is_public"`
}

type MessageLike struct {
	MessageID string    `json:"message_id" db:"message_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type MessageReport struct {
	ID                    string       `json:"id" db:"id"`
	ReportedByID          string       `json:"reported_by" db:"reported_by"`
	Report                string       `json:"report" db:"report"`
	CreatedAt             time.Time    `json:"created_at" db:"created_at"`
	ResolvedAt            sql.NullTime `json:"resolved_at" db:"resolved_at"`
	MessageID             string       `json:"message_id" db:"message_id"`
	AuthorID              string       `json:"author_id" db:"author_id"`
	Text                  string       `json:"text" db:"text"`
	AttachmentType        string       `json:"attachment_type" db:"attachment_type"`
	AttachmentID          string       `json:"attachment_id" db:"attachment_id"`
	AttachmentThumbnailID string       `json:"attachment_thumbnail_id" db:"attachment_thumbnail_id"`
}

type Counts struct {
	TotalCount         int          `db:"total_count"`
	UnreadCount        int          `db:"unread_count"`
	TotalCommentCount  int          `db:"total_comment_count"`
	UnreadCommentCount int          `db:"unread_comment_count"`
	LastMessageTime    sql.NullTime `db:"last_message_time"`
}

type MessageRepo interface {
	Messages(currentUserID string, userIDs []string, from time.Time, count int) []Message
	PublicMessages(userID string, from time.Time, count int) []Message
	GroupMessages(currentUserID, groupID string, from time.Time, count int) []Message
	DirectMessages(currentUserID, friendID string, from time.Time, count int) []Message
	Message(currentUserID string, messageID string) *Message
	PublicMessage(messageID string) *Message
	AddMessage(parentID string, message Message)
	EditMessageText(userID, messageID, text string, updatedAt time.Time) bool
	EditMessageAttachment(userID, messageID, attachmentID, attachmentType, attachmentThumbnailID string, updatedAt time.Time) bool
	DeleteMessage(messageID string) bool
	Comments(currentUserID string, messageIDs []string) map[string][]Message
	LikeMessage(userID, messageID string) int
	UnlikeMessage(userID, messageID string) int
	MessagesLikes(messageIDs []string) map[string][]MessageLike
	MessageLikes(messageID string) []MessageLike
	SetMessageVisibility(userID, messageID string, visibility bool)
	ReportMessage(userID, messageID, report string) string
	MessageReport(reportID string) *MessageReport
	MessageReports() []MessageReport
	DeleteReportedMessage(reportID string) bool
	BlockReportedUser(reportID string) bool
	ResolveMessageReport(reportID string) bool
	DeleteExpiredMessages(until time.Time, onlyGuestMessages bool)
	MarkRead(userID string, messageIDs []string)
	Counts(currentUserID string, userIDs []string) Counts
	GroupCounts(currentUserID string, groupIDs []string) map[string]Counts
	DirectCounts(currentUserID string) map[string]*Counts
	DeleteUserData(tx *sqlx.Tx, userID string) error
}

func NewMessages(db *sqlx.DB) MessageRepo {
	return &messageRepo{
		db: db,
	}
}

type messageRepo struct {
	db *sqlx.DB
}

func (r *messageRepo) Messages(currentUserID string, userIDs []string, from time.Time, count int) []Message {
	if len(userIDs) == 0 {
		return nil
	}

	if from.IsZero() {
		from = maxTimestamp
	}
	if count <= 0 {
		count = defaultMessageCount
	}

	var messages []Message
	query, args, err := sqlx.In(`
			select m.id, m.parent_id, m.user_id, m.text,
			       m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
				   (select count(*) from message_likes where message_id = m.id) likes,
				   case when exists(select * from message_likes where message_id = m.id and user_id = ?) then true else false end liked_by_me
			from messages m
			where m.user_id in (?) and m.parent_id is null
				and m.group_id is null
				and m.friend_id is null
				and m.created_at < ?
			    and m.deleted_at is null
				and not exists(select * from message_visibility mv where mv.user_id = ? and mv.message_id = m.id and mv.visibility = false)
			order by m.created_at desc, m.id
			limit ?;`,
		currentUserID, userIDs, from, currentUserID, count)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)
	err = r.db.Select(&messages, query, args...)
	if err != nil {
		panic(err)
	}
	return messages
}

func (r *messageRepo) PublicMessages(userID string, from time.Time, count int) []Message {
	if from.IsZero() {
		from = maxTimestamp
	}
	if count <= 0 {
		count = defaultMessageCount
	}

	var messages []Message
	err := r.db.Select(&messages, `
		select m.id, m.parent_id, m.user_id, m.text,
			   m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
			   (select count(*) from message_likes where message_id = m.id) likes
		from messages m
		where m.user_id = $1 and m.parent_id is null
		  	and m.is_public = true
			and m.group_id is null
			and m.friend_id is null
			and m.created_at < $2
			and m.deleted_at is null
		order by m.created_at desc, m.id
		limit $3;`,
		userID, from, count)
	if err != nil {
		panic(err)
	}
	return messages
}

func (r *messageRepo) GroupMessages(currentUserID, groupID string, from time.Time, count int) []Message {
	if from.IsZero() {
		from = maxTimestamp
	}
	if count <= 0 {
		count = defaultMessageCount
	}

	var messages []Message
	err := r.db.Select(&messages, `
		select m.id, m.parent_id, m.user_id, m.text,
			   m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
			   (select count(*) from message_likes where message_id = m.id) likes,
			   case when exists(select * from message_likes where message_id = m.id and user_id = $1) then true else false end liked_by_me
		from messages m
		where m.group_id = $2 and m.parent_id is null
			and m.created_at < $3
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = $1 and mv.message_id = m.id and mv.visibility = false)
		order by m.created_at desc, m.id
		limit $4;`,
		currentUserID, groupID, from, count)
	if err != nil {
		panic(err)
	}
	return messages
}

func (r *messageRepo) DirectMessages(userID1, userID2 string, from time.Time, count int) []Message {
	if from.IsZero() {
		from = maxTimestamp
	}
	if count <= 0 {
		count = defaultMessageCount
	}

	var messages []Message
	err := r.db.Select(&messages, `
		select m.id, m.parent_id, m.user_id, m.text,
			   m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
			   (select count(*) from message_likes where message_id = m.id) likes,
			   case when exists(select * from message_likes where message_id = m.id and user_id = $1) then true else false end liked_by_me
		from messages m
		where ((m.user_id = $1 and m.friend_id = $2) or (m.user_id = $2 and m.friend_id = $1))
			and m.parent_id is null
			and m.created_at < $3
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = $1 and mv.message_id = m.id and mv.visibility = false)
		order by m.created_at desc, m.id
		limit $4;`,
		userID1, userID2, from, count)
	if err != nil {
		panic(err)
	}
	return messages
}

func (r *messageRepo) Message(currentUserID string, messageID string) *Message {
	var message Message
	err := r.db.Get(&message, `
		select m.id, m.parent_id, m.user_id, m.text,
			   m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
			   (select count(*) from message_likes where message_id = m.id) likes,
			   case when exists(select * from message_likes where message_id = m.id and user_id = $1) then true else false end liked_by_me
		from messages m
		where m.id = $2`,
		currentUserID, messageID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &message
}

func (r *messageRepo) PublicMessage(messageID string) *Message {
	var message Message
	err := r.db.Get(&message, `
		select m.id, m.parent_id, m.user_id, m.text,
			   m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at, m.group_id, m.friend_id, m.is_public,
			   (select count(*) from message_likes where message_id = m.id) likes
		from messages m
		where m.id = $1 and m.is_public = true`,
		messageID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &message
}

func (r *messageRepo) AddMessage(parentID string, message Message) {
	_, err := r.db.Exec(`
		insert into messages(id, parent_id, user_id, text, attachment_id, attachment_type, attachment_thumbnail_id, created_at, updated_at, group_id, is_guest, friend_id, is_public)
		select $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
		where not exists(select * from messages where id = $1)`,
		message.ID, sql.NullString{String: parentID, Valid: parentID != ""},
		message.UserID,
		message.Text, message.AttachmentID, message.AttachmentType, message.AttachmentThumbnailID,
		message.CreatedAt, message.UpdatedAt, message.GroupID, message.IsGuest, message.FriendID, message.IsPublic)
	if err != nil {
		panic(err)
	}
}

func (r *messageRepo) EditMessageText(userID, messageID, text string, updatedAt time.Time) bool {
	res, err := r.db.Exec(`
		update messages
		set text = $1, updated_at = $2
		where id = $3 and user_id = $4`,
		text, updatedAt, messageID, userID)
	if err != nil {
		panic(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		panic(err)
	}
	if rowsAffected < 1 {
		return false
	}
	return true
}

func (r *messageRepo) EditMessageAttachment(userID, messageID, attachmentID, attachmentType, attachmentThumbnailID string, updatedAt time.Time) bool {
	ok := false
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		var message Message
		err := tx.Get(&message, `
			select attachment_id, attachment_thumbnail_id
			from messages
			where id = $1 and user_id = $2`,
			messageID, userID)
		if err != nil && !merry.Is(err, sql.ErrNoRows) {
			return merry.Wrap(err)
		}
		if message.AttachmentID != "" && message.AttachmentID != attachmentID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				message.AttachmentID, updatedAt)
			if err != nil {
				return merry.Wrap(err)
			}
		}
		if message.AttachmentThumbnailID != "" && message.AttachmentThumbnailID != message.AttachmentID && message.AttachmentThumbnailID != attachmentThumbnailID {
			_, err = tx.Exec(`
				insert into blob_pending_deletes(blob_id, deleted_at)
				values ($1, $2)`,
				message.AttachmentThumbnailID, updatedAt)
			if err != nil {
				return merry.Wrap(err)
			}
		}

		res, err := r.db.Exec(`
		update messages
		set attachment_id = $1, attachment_type = $2, attachment_thumbnail_id = $3, updated_at = $4
		where id = $5 and user_id = $6`,
			attachmentID, attachmentType, attachmentThumbnailID, updatedAt, messageID, userID)
		if err != nil {
			return merry.Wrap(err)
		}
		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return merry.Wrap(err)
		}
		if rowsAffected < 1 {
			return nil
		}
		ok = true
		return nil
	})
	if err != nil {
		panic(err)
	}
	return ok
}

func (r *messageRepo) DeleteMessage(messageID string) bool {
	var ok bool
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		ok = r.deleteMessage(tx, messageID)
		return nil
	})
	if err != nil {
		panic(err)
	}
	return ok
}

func (r *messageRepo) deleteMessage(tx *sqlx.Tx, messageID string) bool {
	var message Message
	err := tx.Get(&message, `
		select attachment_id, attachment_thumbnail_id
		from messages
		where id = $1;`,
		messageID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false
		}
		panic(err)
	}
	now := common.CurrentTimestamp()
	if message.AttachmentID != "" {
		_, err = tx.Exec(`
			insert into blob_pending_deletes(blob_id, deleted_at)
			values ($1, $2)`,
			message.AttachmentID, now)
		if err != nil {
			panic(err)
		}
	}
	if message.AttachmentThumbnailID != "" && message.AttachmentThumbnailID != message.AttachmentID {
		_, err = tx.Exec(`
			insert into blob_pending_deletes(blob_id, deleted_at)
			values ($1, $2)`,
			message.AttachmentThumbnailID, now)
		if err != nil {
			panic(err)
		}
	}

	_, err = tx.Exec(`
		delete from message_likes
		where message_id = $1;`,
		messageID)
	if err != nil {
		panic(err)
	}

	_, err = tx.Exec(`
		update messages
		set text = '(deleted)',
		    attachment_type = '',
		    attachment_id = '',
		    attachment_thumbnail_id = '',
		    deleted_at = $1
		where id = $2;`,
		common.CurrentTimestamp(), messageID)
	if err != nil {
		panic(err)
	}
	return true
}

func (r *messageRepo) Comments(currentUserID string, messageIDs []string) map[string][]Message {
	if len(messageIDs) == 0 {
		return nil
	}

	var comments []Message
	query, args, err := sqlx.In(`
			select m.id, m.parent_id, m.user_id, m.text, m.attachment_id, m.attachment_type, m.attachment_thumbnail_id, m.created_at, m.updated_at,
				   (select count(*) from message_likes where message_id = m.id) likes,
				   case when exists(select * from message_likes where message_id = m.id and user_id = ?) then true else false end liked_by_me
			from messages m
			where m.parent_id in (?)
				and not exists(select * from message_visibility mv where mv.user_id = ? and mv.message_id = m.id and mv.visibility = false)
			    and m.deleted_at is null
			order by m.created_at, m.id`,
		currentUserID, messageIDs, currentUserID)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)
	err = r.db.Select(&comments, query, args...)
	if err != nil {
		panic(err)
	}

	result := make(map[string][]Message)
	for _, comment := range comments {
		result[comment.ParentID.String] = append(result[comment.ParentID.String], comment)
	}
	return result
}

func (r *messageRepo) LikeMessage(userID, messageID string) int {
	_, err := r.db.Exec(`
		insert into message_likes(message_id, user_id, created_at)
		select $1, $2, $3
		where not exists(select * from message_likes where message_id = $1 and user_id = $2)`,
		messageID, userID, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
	var likes int
	err = r.db.Get(&likes, "select count(*) from message_likes where message_id = $1", messageID)
	if err != nil {
		panic(err)
	}
	return likes
}

func (r *messageRepo) UnlikeMessage(userID, messageID string) int {
	_, err := r.db.Exec(`
		delete from message_likes
		where message_id = $1 and user_id = $2;`,
		messageID, userID)
	if err != nil {
		panic(err)
	}
	var likes int
	err = r.db.Get(&likes, "select count(*) from message_likes where message_id = $1", messageID)
	if err != nil {
		panic(err)
	}
	return likes
}

func (r *messageRepo) MessagesLikes(messageIDs []string) map[string][]MessageLike {
	if len(messageIDs) == 0 {
		return nil
	}

	var plainLikes []MessageLike
	query, args, err := sqlx.In(`
		select ml.message_id, ml.user_id, ml.created_at
		from message_likes ml
		where ml.message_id in (?)
		order by ml.message_id, ml.created_at`, messageIDs)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)

	err = r.db.Select(&plainLikes, query, args...)
	if err != nil {
		panic(err)
	}
	if len(plainLikes) == 0 {
		return nil
	}
	likes := make(map[string][]MessageLike)
	for _, like := range plainLikes {
		likes[like.MessageID] = append(likes[like.MessageID], like)
	}
	return likes
}

func (r *messageRepo) MessageLikes(messageID string) []MessageLike {
	allLikes := r.MessagesLikes([]string{messageID})
	if len(allLikes) == 0 {
		return nil
	}

	for _, messageLikes := range allLikes {
		return messageLikes
	}
	return nil
}

func (r *messageRepo) SetMessageVisibility(userID, messageID string, visibility bool) {
	if visibility {
		_, err := r.db.Exec(`
			delete from message_visibility
			where user_id = $1 and message_id = $2;`,
			userID, messageID)
		if err != nil {
			panic(err)
		}
	} else {
		_, err := r.db.Exec(`
			insert into message_visibility(user_id, message_id, visibility, created_at)
			select $1, $2, false, $3
			where not exists(select * from message_visibility where user_id = $1 and message_id = $2)`,
			userID, messageID, common.CurrentTimestamp())
		if err != nil {
			panic(err)
		}
	}
}

func (r *messageRepo) ReportMessage(userID, messageID, report string) string {
	reportID := common.GenerateUUID()
	_, err := r.db.Exec(`
		insert into message_reports(id, user_id, message_id, report, created_at)
		values ($1, $2, $3, $4, $5)`,
		reportID, userID, messageID, report, common.CurrentTimestamp())
	if err != nil {
		panic(err)
	}
	return reportID
}

func (r *messageRepo) MessageReport(reportID string) *MessageReport {
	var report MessageReport
	err := r.db.Get(&report, `
		select mr.id, mr.user_id reported_by,
		       mr.report, mr.created_at, mr.resolved_at,
		       m.id as message_id, m.user_id author_id,
		       m.text, m.attachment_type, m.attachment_id, m.attachment_thumbnail_id 
		from message_reports mr
			inner join messages m on m.id = mr.message_id
		where mr.id = $1`,
		reportID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return nil
		}
		panic(err)
	}
	return &report
}

func (r *messageRepo) MessageReports() []MessageReport {
	var reports []MessageReport
	err := r.db.Select(&reports, `
		select mr.id, mr.user_id reported_by,
		       mr.report, mr.created_at, mr.resolved_at,
		       m.id as message_id, m.user_id author_id,
		       m.text, m.attachment_type, m.attachment_id, m.attachment_thumbnail_id 
		from message_reports mr
			inner join messages m on m.id = mr.message_id
`)
	if err != nil {
		panic(err)
	}
	return reports
}

func (r *messageRepo) DeleteReportedMessage(reportID string) bool {
	var message Message
	err := r.db.Get(&message, `
		select id, user_id
		from messages
		where id = (select message_id from message_reports where id = $1)`,
		reportID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return false
		}
		panic(err)
	}

	ok := false
	err = common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		if !r.deleteMessage(tx, message.ID) {
			return nil
		}
		_, err := tx.Exec(`
		update message_reports
		set message_deleted_at = $1
		where id = $2`,
			common.CurrentTimestamp(), reportID)
		if err != nil {
			return merry.Wrap(err)
		}
		ok = true
		return nil
	})
	if err != nil {
		panic(err)
	}
	return ok
}

func (r *messageRepo) BlockReportedUser(reportID string) bool {
	var message Message
	err := r.db.Get(&message, `
		select id, user_id
		from messages
		where id = (select message_id from message_reports where id = $1)`,
		reportID)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return false
		}
		panic(err)
	}

	ok := false
	err = common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		now := common.CurrentTimestamp()

		_, err := tx.Exec(`
		update users
		set blocked_at = $1
		where id = $2 and blocked_at is null;`,
			now, message.UserID)
		if err != nil {
			return merry.Wrap(err)
		}
		_, err = tx.Exec(`
		update message_reports
		set user_ejected_at = $1
		where id = $2`,
			now, reportID)
		if err != nil {
			return merry.Wrap(err)
		}
		ok = true
		return nil
	})
	if err != nil {
		panic(err)
	}
	return ok
}

func (r *messageRepo) ResolveMessageReport(reportID string) bool {
	res, err := r.db.Exec(`
		update message_reports
		set resolved_at = $1
		where id = $2`,
		common.CurrentTimestamp(), reportID)
	if err != nil {
		panic(err)
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		panic(err)
	}
	if rowsAffected == 0 {
		return false
	}
	return true
}

func (r *messageRepo) DeleteExpiredMessages(until time.Time, onlyGuestMessages bool) {
	until = until.UTC()
	err := common.RunInTransaction(r.db, func(tx *sqlx.Tx) error {
		_, err := tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			delete from message_likes
			where message_id in (select id from mc);`,
			onlyGuestMessages, until)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			delete from message_visibility
			where message_id in (select id from mc);`,
			onlyGuestMessages, until)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			delete from message_reports
			where message_id in (select id from mc);`,
			onlyGuestMessages, until)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			delete from message_reads
			where message_id in (select id from mc);`,
			onlyGuestMessages, until)
		if err != nil {
			return merry.Wrap(err)
		}

		_, err = tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			insert into blob_pending_deletes(blob_id, deleted_at)
			select attachment_id, $3::timestamptz
			from messages
			where id in (select id from mc) and attachment_id != ''
			union
			select attachment_thumbnail_id, $3::timestamptz
			from messages
			where id in (select id from mc) and attachment_thumbnail_id != '';`,
			onlyGuestMessages, until, common.CurrentTimestamp())
		if err != nil {
			return merry.Wrap(err)
		}

		res, err := tx.Exec(`
			with m as (select id from messages where parent_id is null and ($1 = false or is_guest = true) and created_at < $2),
				 c as (select id from messages where parent_id in (select id from m)),
				 mc as (select id from m union select id from c)
			delete from messages
			where id in (select id from mc);`,
			onlyGuestMessages, until)
		if err != nil {
			return merry.Wrap(err)
		}

		rowsAffected, err := res.RowsAffected()
		if err == nil {
			log.Printf("Deleted %d expired messages", rowsAffected)
		}

		return nil
	})
	if err != nil {
		panic(err)
	}
}

func (r *messageRepo) MarkRead(userID string, messageIDs []string) {
	if len(messageIDs) == 0 {
		return
	}

	query, args, err := sqlx.In(`
		insert into message_reads(user_id, message_id, read_at)
		select ?, id, ?
		from messages
		where user_id <> ? and id in (?)
		on conflict do nothing;`,
		userID, common.CurrentTimestamp(), userID, messageIDs,
	)
	if err != nil {
		panic(err)
	}

	query = r.db.Rebind(query)

	_, err = r.db.Exec(query, args...)
	if err != nil {
		panic(err)
	}
}

func (r *messageRepo) Counts(currentUserID string, userIDs []string) Counts {
	if len(userIDs) == 0 {
		return Counts{}
	}

	query, args, err := sqlx.In(`
		select
			   coalesce(sum(case when m.parent_id is null then 1 end), 0) total_count, 
			   coalesce(sum(case when m.parent_id is null and not exists(select * from message_reads where user_id = ? and message_id = m.id) then 1 end), 0) unread_count, 
			   coalesce(sum(case when m.parent_id is not null then 1 end), 0) total_comment_count, 
			   coalesce(sum(case when m.parent_id is not null and not exists(select * from message_reads where user_id = ? and message_id = m.id) then 1 end), 0) unread_comment_count,
		       max(m.created_at) last_message_time
		from messages m
		where m.user_id <> ? and m.user_id in (?)
			and m.group_id is null
			and m.friend_id is null
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = ? and mv.message_id = m.id and mv.visibility = false);`,
		currentUserID, currentUserID, currentUserID, userIDs, currentUserID)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)

	var counts Counts
	err = r.db.Get(&counts, query, args...)
	if err != nil {
		panic(err)
	}
	return counts
}

func (r *messageRepo) GroupCounts(currentUserID string, groupIDs []string) map[string]Counts {
	if len(groupIDs) == 0 {
		return nil
	}

	query, args, err := sqlx.In(`
		select
			   m.group_id,
			   coalesce(sum(case when m.parent_id is null then 1 end), 0) total_count, 
			   coalesce(sum(case when m.parent_id is null and not exists(select * from message_reads where user_id = ? and message_id = m.id) then 1 end), 0) unread_count, 
			   coalesce(sum(case when m.parent_id is not null then 1 end), 0) total_comment_count, 
			   coalesce(sum(case when m.parent_id is not null and not exists(select * from message_reads where user_id = ? and message_id = m.id) then 1 end), 0) unread_comment_count, 
		       max(m.created_at) last_message_time
		from messages m
		where m.user_id <> ?
			and m.group_id in (?)
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = ? and mv.message_id = m.id and mv.visibility = false)
		group by m.group_id;`,
		currentUserID, currentUserID, currentUserID, groupIDs, currentUserID)
	if err != nil {
		panic(err)
	}
	query = r.db.Rebind(query)

	var counts []struct {
		GroupID            string       `db:"group_id"`
		TotalCount         int          `db:"total_count"`
		UnreadCount        int          `db:"unread_count"`
		TotalCommentCount  int          `db:"total_comment_count"`
		UnreadCommentCount int          `db:"unread_comment_count"`
		LastMessageTime    sql.NullTime `db:"last_message_time"`
	}
	err = r.db.Select(&counts, query, args...)
	if err != nil {
		panic(err)
	}

	result := make(map[string]Counts)
	for _, count := range counts {
		result[count.GroupID] = Counts{
			TotalCount:         count.TotalCount,
			UnreadCount:        count.UnreadCount,
			TotalCommentCount:  count.TotalCommentCount,
			UnreadCommentCount: count.UnreadCommentCount,
			LastMessageTime:    count.LastMessageTime,
		}
	}

	return result
}

func (r *messageRepo) DirectCounts(currentUserID string) map[string]*Counts {
	query := `
		select
			m.user_id,
			coalesce(sum(case when m.parent_id is null then 1 end), 0) total_count, 
			coalesce(sum(case when m.parent_id is null and not exists(select * from message_reads where user_id = $1 and message_id = m.id) then 1 end), 0) unread_count, 
			coalesce(sum(case when m.parent_id is not null then 1 end), 0) total_comment_count, 
			coalesce(sum(case when m.parent_id is not null and not exists(select * from message_reads where user_id = $1 and message_id = m.id) then 1 end), 0) unread_comment_count, 
			max(m.created_at) last_message_time
		from messages m
		where m.user_id <> $1
			and m.friend_id = $1
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = $1 and mv.message_id = m.id and mv.visibility = false)
		group by m.user_id;`
	var toMeCounts []struct {
		UserID             string       `db:"user_id"`
		TotalCount         int          `db:"total_count"`
		UnreadCount        int          `db:"unread_count"`
		TotalCommentCount  int          `db:"total_comment_count"`
		UnreadCommentCount int          `db:"unread_comment_count"`
		LastMessageTime    sql.NullTime `db:"last_message_time"`
	}
	err := r.db.Select(&toMeCounts, query, currentUserID)
	if err != nil {
		panic(err)
	}

	query = `
		select
			m.friend_id,
			coalesce(sum(case when m.parent_id is null then 1 end), 0) total_count, 
			coalesce(sum(case when m.parent_id is not null then 1 end), 0) total_comment_count, 
			max(m.created_at) last_message_time
		from messages m
		where m.user_id = $1
			and m.friend_id <> $1
			and m.deleted_at is null
			and not exists(select * from message_visibility mv where mv.user_id = $1 and mv.message_id = m.id and mv.visibility = false)
		group by m.friend_id;`
	var fromMeCounts []struct {
		FriendID          string       `db:"friend_id"`
		TotalCount        int          `db:"total_count"`
		TotalCommentCount int          `db:"total_comment_count"`
		LastMessageTime   sql.NullTime `db:"last_message_time"`
	}
	err = r.db.Select(&fromMeCounts, query, currentUserID)
	if err != nil {
		panic(err)
	}

	result := make(map[string]*Counts)
	for _, count := range toMeCounts {
		result[count.UserID] = &Counts{
			TotalCount:         count.TotalCount,
			UnreadCount:        count.UnreadCount,
			TotalCommentCount:  count.TotalCommentCount,
			UnreadCommentCount: count.UnreadCommentCount,
			LastMessageTime:    count.LastMessageTime,
		}
	}
	for _, count := range fromMeCounts {
		if c, ok := result[count.FriendID]; ok {
			if c.LastMessageTime.Time.Before(count.LastMessageTime.Time) {
				c.LastMessageTime = count.LastMessageTime
			}
			c.TotalCount += count.TotalCount
			c.TotalCommentCount += count.TotalCommentCount
		} else {
			result[count.FriendID] = &Counts{
				LastMessageTime:   count.LastMessageTime,
				TotalCount:        count.TotalCount,
				TotalCommentCount: count.TotalCommentCount,
			}
		}
	}
	return result
}

func (r *messageRepo) DeleteUserData(tx *sqlx.Tx, userID string) error {
	_, err := tx.Exec(`
		delete from message_likes
		where user_id = $1;`,
		userID)
	if err != nil {
		return merry.Wrap(err)
	}

	_, err = tx.Exec(`
		delete from message_visibility
		where user_id = $1;`,
		userID)
	if err != nil {
		return merry.Wrap(err)
	}

	_, err = tx.Exec(`
		delete from message_reports
		where user_id = $1;`,
		userID)
	if err != nil {
		return merry.Wrap(err)
	}

	_, err = tx.Exec(`
		delete from message_reads
		where user_id = $1;`,
		userID)
	if err != nil {
		return merry.Wrap(err)
	}

	_, err = tx.Exec(`
		insert into blob_pending_deletes(blob_id, deleted_at)
		select attachment_id, $1::timestamptz
		from messages
		where user_id = $2 and attachment_id != ''
		union
		select attachment_thumbnail_id, $1::timestamptz
		from messages
		where user_id = $2 and attachment_thumbnail_id != '';`,
		common.CurrentTimestamp(), userID)
	if err != nil {
		return merry.Wrap(err)
	}

	_, err = tx.Exec(`
		update messages
		set text = '(deleted)',
		    attachment_type = '',
		    attachment_id = '',
		    attachment_thumbnail_id = '',
		    deleted_at = $1
		where user_id = $2`,
		common.CurrentTimestamp(), userID)

	return nil
}
