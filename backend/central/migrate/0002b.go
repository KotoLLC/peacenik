package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002b",
		Up: []string{
			`
alter table users add confirmed_at timestamp with time zone;`,
		},
		Down: []string{},
	}
}
