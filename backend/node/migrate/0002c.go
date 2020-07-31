package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002c",
		Up: []string{
			`
create table notifications
(
	id text not null constraint notifications_pk primary key,
	user_id text not null,
	text text not null,
	type text not null,
	data json not null,
	created_at timestamp with time zone not null,
	read_at timestamp with time zone
);
`,
			`
create table users
(
	id text not null constraint users_pk primary key,
	name text not null
);
`,
		},
		Down: []string{},
	}
}
