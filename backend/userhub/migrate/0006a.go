package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0006a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0006a",
		Up: []string{
			`
alter table users add background_id text default '' not null;
`,
		},
		Down: []string{},
	}
}
