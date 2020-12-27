package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0004d() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004d",
		Up: []string{
			`
alter table group_invites add message text not null default '';
`,
		},
		Down: []string{},
	}
}
