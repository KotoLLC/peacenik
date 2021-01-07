package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002m() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002m",
		Up: []string{
			`
alter table invites add auto_accepted boolean default false not null;
`,
		},
		Down: []string{},
	}
}
