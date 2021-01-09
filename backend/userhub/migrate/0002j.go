package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002j() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002j",
		Up: []string{
			`
drop index users_email_uindex;
`,
		},
		Down: []string{},
	}
}
