package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002o() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002o",
		Up: []string{
			`
alter table user_message_hubs add blocked_at timestamp with time zone;`,
		},
		Down: []string{},
	}
}
