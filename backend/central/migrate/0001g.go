package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001g() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001g",
		Up: []string{
			`
create unique index nodes_address_uindex on nodes (address);
`,
		},
		Down: []string{},
	}
}
