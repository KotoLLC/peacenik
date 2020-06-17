package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001a",
		Up: []string{
			`
create table messages
(
	id text not null constraint messages_pk primary key,
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at text not null,
	updated_at text not null
);

create index messages_user_id_index on messages (user_id);
`,
		},
		Down: []string{},
	}
}
