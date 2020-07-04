package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001j() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001j",
		Up: []string{
			`
alter table invites add rejected_at text default '' not null;`,
		},
		Down: []string{},
	}
}
