package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0009a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0009a",
		Up: []string{
			`
alter table messages add is_public boolean default false not null;`,
		},
	}
}
