package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0007a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0007a",
		Up: []string{
			`
alter table users add hide_identity boolean default false not null;
`,
		},
	}
}
