package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0004c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004c",
		Up: []string{
			`
alter table group_invites add accepted_by_admin_at timestamp with time zone;
`,
		},
		Down: []string{},
	}
}
