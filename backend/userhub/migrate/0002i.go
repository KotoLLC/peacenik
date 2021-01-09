package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002i() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002i",
		Up: []string{
			`
drop index users_name_uindex;
create unique index "users_name_uindex" on users ((lower(name)));
`,
		},
		Down: []string{},
	}
}
