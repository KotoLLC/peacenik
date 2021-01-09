package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0003b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0003b",
		Up: []string{
			`
alter table users add full_name text default '' not null;`,
		},
		Down: []string{},
	}
}
