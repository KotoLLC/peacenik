package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002d() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002d",
		Up: []string{
			`
create table message_likes
(
	message_id text not null constraint message_likes_messages_id_fk_message_id references messages (id),
	user_id text not null,
	created_at timestamp with time zone not null,
	constraint message_likes_pk primary key (message_id, user_id)
);
`,
		},
		Down: []string{},
	}
}
