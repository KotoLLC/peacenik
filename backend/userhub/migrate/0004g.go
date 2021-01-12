package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0004g() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004g",
		Up: []string{
			`
alter table message_hubs add allow_friend_groups boolean default false not null;
`,
		},
		Down: []string{},
	}
}
