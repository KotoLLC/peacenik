package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002e",
		Up: []string{
			`
create table message_visibility
(
	user_id text not null constraint message_visibility_users_id_fk references users,
	message_id text not null constraint message_visibility_messages_id_fk references messages,
	visibility boolean not null,
	created_at timestamp with time zone not null,
	constraint message_visibility_pk primary key (user_id, message_id)
);
`,
		},
		Down: []string{},
	}
}
