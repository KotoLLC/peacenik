package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001i() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001i",
		Up: []string{
			`
drop table user_nodes;`,
		},
		Down: []string{},
	}
}
