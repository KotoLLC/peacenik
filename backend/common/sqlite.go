package common

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

const (
	dbDialect = "sqlite3"
)

func OpenDatabase(dbPath string, migrate func(db *sqlx.DB, dialect string) (n int, err error)) (db *sqlx.DB, migrationsCount int, err error) {
	dbDir := filepath.Dir(dbPath)
	if _, err := os.Stat(dbDir); os.IsNotExist(err) {
		_ = os.MkdirAll(dbDir, 0700)
	}

	connectionStr := dbPath
	if _, err = os.Stat(dbPath); os.IsNotExist(err) {
		db, err = sqlx.Open(dbDialect, connectionStr)
	} else {
		db, err = sqlx.Connect(dbDialect, connectionStr)
	}

	if err != nil {
		return nil, 0, fmt.Errorf("can't connect to database: %w", err)
	}

	n, err := migrate(db, dbDialect)
	if err != nil {
		return nil, 0, fmt.Errorf("can't apply migration to the database: %w", err)
	}

	_ = db.Close()

	connectionStr = fmt.Sprintf("%s?_foreign_keys=true", dbPath)
	db, err = sqlx.Open(dbDialect, connectionStr)
	if err != nil {
		return nil, 0, fmt.Errorf("can't connect to database: %w", err)
	}

	db.SetMaxOpenConns(1)
	return db, n, nil
}
