package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002k() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002k",
		Up: []string{
			`
create table fcm_tokens
(
	user_id text not null constraint fcm_tokens_users_id_fk references users,
	token text not null,
	device_id text not null,
	created_at timestamp with time zone not null,
	constraint fcm_tokens_pk primary key (user_id, token)
);
`,
		},
		Down: []string{},
	}
}
