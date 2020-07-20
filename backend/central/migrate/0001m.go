package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001m() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001m",
		Up: []string{
			`
alter table users add avatar_original_id text default '' not null;
alter table users add avatar_thumbnail_id text default '' not null;`,
		},
		Down: []string{},
	}
}
