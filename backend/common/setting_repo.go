package common

import (
	"database/sql"

	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"
)

type Setting struct {
	ID    string `db:"id"`
	Value string `db:"value"`
}

type SettingRepo interface {
	Get(id string) (string, bool, error)
	Add(id, value string) error
}

type settingRepo struct {
	db *sqlx.DB
}

func NewSettings(db *sqlx.DB) SettingRepo {
	return &settingRepo{
		db: db,
	}
}

func (r *settingRepo) Get(id string) (string, bool, error) {
	var value string
	err := r.db.Get(&value, `select value from settings where id = $1`, id)
	if err != nil {
		if merry.Is(err, sql.ErrNoRows) {
			return "", false, nil
		}
		return "", false, merry.Wrap(err)
	}
	return value, true, nil
}

func (r *settingRepo) Add(id, value string) error {
	_, err := r.db.Exec(`
		insert into settings(id, value, created_at, updated_at)
		values ($1, $2, $3, $3)`,
		id, value, CurrentTimestamp())
	if err != nil {
		return merry.Wrap(err)
	}
	return nil
}
