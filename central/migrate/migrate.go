package migrate

import (
	"github.com/jmoiron/sqlx"
	migrate "github.com/rubenv/sql-migrate"
)

func Migrate(db *sqlx.DB, dialect string) (n int, err error) {
	migrationSource := &migrate.MemoryMigrationSource{
		Migrations: []*migrate.Migration{
			migration0001a(),
			migration0001b(),
			migration0001c(),
			migration0001d(),
			migration0001e(),
			migration0001f(),
			migration0001g(),
		},
	}

	n, err = migrate.Exec(db.DB, dialect, migrationSource, migrate.Up)
	if err != nil {
		return 0, err
	}
	return n, nil
}
