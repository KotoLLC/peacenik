package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0004e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004e",
		Up: []string{
			`
alter table group_invites add rejected_by_admin_at timestamp with time zone;
`,
		},
		Down: []string{},
	}
}
