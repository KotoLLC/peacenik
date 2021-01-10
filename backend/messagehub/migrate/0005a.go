package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0005a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0005a",
		Up: []string{
			`
alter table messages add is_guest boolean default false not null;`,
		},
		Down: []string{},
	}
}
