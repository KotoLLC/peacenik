package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0004f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004f",
		Up: []string{
			`
alter table groups add background_id text default '' not null;
`,
		},
		Down: []string{},
	}
}
