package repo

import (
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/common"
)

var (
	ErrRelationNotFound = errors.New("relation not found")
)

type RelationRepo interface {
	AddRelation(user1ID, user2Email, community string) error
	AcceptRelation(user1ID, user2ID, user2Email, community string) error
	Friends(user User) ([]User, error)
	Communities(user User) ([]string, error)
}

type relationRepo struct {
	db *sqlx.DB
}

func NewRelations(db *sqlx.DB) RelationRepo {
	return &relationRepo{
		db: db,
	}
}

func (r *relationRepo) AddRelation(user1ID, user2Email, community string) error {
	_, err := r.db.Exec(`
		insert into relations(user1_id, user2_id, community, created_at)
		select $1, $2, $3, $4
		where not exists(select * from relations where user1_id = $1 and user2_id = $2 and community = $3)`,
		user1ID, user2Email, community, common.CurrentTimestamp())
	return err
}

func (r *relationRepo) AcceptRelation(user1ID, user2ID, user2Email, community string) error {
	res, err := r.db.Exec(`
		update relations
		set user2_id = $1, accepted_at = $2
		where user1_id = $3 and user2_id in ($1, $4) and community = $5`,
		user2ID, common.CurrentTimestamp(), user1ID, user2Email, community)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrRelationNotFound
	}
	return nil
}

func (r *relationRepo) Friends(user User) ([]User, error) {
	var friends []User
	err := r.db.Select(&friends, `
		select id, name
		from users
		where id in (
			select user2_id
			from relations
			where user1_id = $1 and accepted_at <> ''
			union
			select user1_id
			from relations
			where user2_id = $1 and accepted_at <> '')`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return friends, nil
}

func (r *relationRepo) Communities(user User) ([]string, error) {
	var communities []string
	err := r.db.Select(&communities, `
		select distinct community
		from relations
		where accepted_at <> ''
		  and (user1_id in (
				select $1
				union
				select user2_id
				from relations
				where user1_id = $1 and accepted_at <> ''
				union
				select user1_id
				from relations
				where user2_id = $1 and accepted_at <> '')
			  or user2_id in (
				select $1
				union
				select user2_id
				from relations
				where user1_id = $1 and accepted_at <> ''
				union
				select user1_id
				from relations
				where user2_id = $1 and accepted_at <> ''))`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return communities, nil
}
