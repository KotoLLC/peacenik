package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002l() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002l",
		Up: []string{
			`
alter table fcm_tokens add os text default '' not null;
`,
		},
		Down: []string{},
	}
}
