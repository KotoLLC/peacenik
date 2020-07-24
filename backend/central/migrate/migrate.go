package migrate

import (
	"github.com/jmoiron/sqlx"
	migrate "github.com/rubenv/sql-migrate"
)

func Migrate(db *sqlx.DB, dialect string) (n int, err error) {
	migrationSource := &migrate.MemoryMigrationSource{
		Migrations: []*migrate.Migration{
			migration0002a(),
		},
	}

	n, err = migrate.Exec(db.DB, dialect, migrationSource, migrate.Up)
	if err != nil {
		return 0, err
	}
	return n, nil
}
