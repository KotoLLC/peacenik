package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002e",
		Up: []string{
			`
create table notifications
(
	id text not null constraint notifications_pk primary key,
	user_id text not null constraint notifications_users_id_fk_user_id references users,
	text text not null,
	type text not null,
	data json not null,
	created_at timestamp with time zone not null,
	read_at timestamp with time zone
);
`,
		},
		Down: []string{},
	}
}
