package migrate

import (
	"github.com/ansel1/merry"
	"github.com/jmoiron/sqlx"
	migrate "github.com/rubenv/sql-migrate"
)

func Migrate(db *sqlx.DB, dialect string) (n int, err error) {
	migrationSource := &migrate.MemoryMigrationSource{
		Migrations: []*migrate.Migration{
			m0002a(), m0002b(), m0002c(), m0002d(), m0002e(), m0002f(),
			m0003a(), m0003b(),
			m0004a(),
			m0005a(),
			m0006a(),
			m0007a(),
		},
	}

	n, err = migrate.Exec(db.DB, dialect, migrationSource, migrate.Up)
	if err != nil {
		return 0, merry.Wrap(err)
	}
	return n, nil
}
