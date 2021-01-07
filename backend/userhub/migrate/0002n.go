package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002n() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002n",
		Up: []string{
			`
alter table fcm_tokens add updated_at timestamp with time zone;
alter table fcm_tokens add deleted_at timestamp with time zone;`,
			`
update fcm_tokens set updated_at = created_at;
`,
			`
alter table fcm_tokens alter updated_at set not null;
`,
		},
		Down: []string{},
	}
}
