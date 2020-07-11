package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001c",
		Up: []string{
			`
drop index messages_user_id_index;
create index messages_user_id_created_at_index on messages (user_id asc, created_at asc);`,
		},
		Down: []string{},
	}
}
