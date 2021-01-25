package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0006a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0006a",
		Up: []string{
			`
alter table users drop column name;
alter table users drop column full_name;
alter table messages drop column user_name;
`,
		},
	}
}
