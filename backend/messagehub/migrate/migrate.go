package migrate

import (
	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"
	migrate "github.com/rubenv/sql-migrate"
)

func Migrate(db *sqlx.DB, dialect string) (n int, err error) {
	migrationSource := &migrate.MemoryMigrationSource{
		Migrations: []*migrate.Migration{
			migration0002a(),
			migration0002b(),
			migration0002c(),
			migration0002d(),
			migration0002e(),
		},
	}

	n, err = migrate.Exec(db.DB, dialect, migrationSource, migrate.Up)
	if err != nil {
		return 0, merry.Wrap(err)
	}
	return n, nil
}
