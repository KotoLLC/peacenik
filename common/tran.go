package common

import (
	"github.com/jmoiron/sqlx"
)

func RunInTransaction(db *sqlx.DB, action func(tx *sqlx.Tx) error) error {
	tx := db.MustBegin()
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	err := action(tx)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	tx = nil
	return nil
}
