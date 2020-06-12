package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001a",
		Up: []string{
			`
create table users
(
	id text not null constraint users_pk primary key,
	name text not null,
	email text not null,
	password_hash text not null,
	created_at text not null,
	updated_at text not null
);

create unique index users_email_uindex on users (email);
`,
		},
		Down: []string{},
	}
}
