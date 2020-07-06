package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001k() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001k",
		Up: []string{
			`
alter table nodes add details text default '' not null;`,
		},
		Down: []string{},
	}
}
