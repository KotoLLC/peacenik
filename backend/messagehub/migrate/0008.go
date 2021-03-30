package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0008a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0008a",
		Up: []string{
			`
create table message_reads
(
	user_id text not null constraint message_reads_users_id_fk references users (id),
	message_id text not null constraint message_reads_messages_id_fk references messages,
	read_at timestamp with time zone not null,
	constraint message_reads_pk primary key (user_id, message_id)
);

`,
		},
	}
}
