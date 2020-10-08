package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002p() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002p",
		Up: []string{
			`
create table blocked_users
(
	user_id text not null constraint blocked_users_users_id_fk references users,
	blocked_user_id text not null constraint blocked_users_users_id_fk_2 references users,
	created_at timestamp with time zone not null,
	constraint blocked_users_pk primary key (user_id, blocked_user_id)
);`,
		},
		Down: []string{},
	}
}
