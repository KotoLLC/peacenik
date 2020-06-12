package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001b",
		Up: []string{
			`
create unique index users_name_uindex on users (name);
`,
		},
		Down: []string{},
	}
}
