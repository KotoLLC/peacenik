package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002c",
		Up: []string{
			`
create table blob_pending_deletes
(
	id serial not null constraint blob_pending_deletes_pk primary key,
	blob_id text not null,
	deleted_at timestamp with time zone
);
`,
		},
		Down: []string{},
	}
}
