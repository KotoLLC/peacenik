package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002a",
		Up: []string{
			`
create table messages
(
	id text not null constraint messages_pk primary key,
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create index messages_user_id_index on messages (user_id);
`,
			`
create table comments
(
	id text not null constraint comments_pk primary key,
	message_id text not null constraint comments_messages_id_fk_message_id references messages (id),
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create index comments_message_id_index on comments (message_id);
`,
		},
		Down: []string{},
	}
}
