package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0004a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004a",
		Up: []string{
			`
alter table messages add group_id text;`,
		},
		Down: []string{},
	}
}
