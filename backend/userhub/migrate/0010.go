package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0010a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0010a",
		Up: []string{
			`
alter table message_hubs add expiration_days int default 0 not null;`,
		},
	}
}
