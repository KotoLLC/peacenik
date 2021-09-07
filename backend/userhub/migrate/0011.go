package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0011a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0011a",
		Up: []string{
			`
alter table user_message_hubs add public_at timestamp with time zone;`,
		},
	}
}
