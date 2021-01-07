package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002f",
		Up: []string{
			`
alter table nodes add post_limit int default 0 not null;
`,
		},
		Down: []string{},
	}
}
