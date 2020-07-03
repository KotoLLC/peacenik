package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001b",
		Up: []string{
			`
create table comments
(
	id text not null constraint comments_pk primary key,
	message_id text not null,
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at text not null,
	updated_at text not null
);

create index comments_message_id_index on comments (message_id);
`,
		},
		Down: []string{},
	}
}
