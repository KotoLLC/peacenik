package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0005a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0005a",
		Up: []string{
			`
alter table user_message_hubs add min_distance integer default 0 not null;`,
		},
		Down: []string{},
	}
}
