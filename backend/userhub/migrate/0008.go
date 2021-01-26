package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0008a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0008a",
		Up: []string{
			`
create table user_keys
(
	id text not null constraint user_keys_pk primary key,
	user1_id text not null constraint user_keys_users_id_fk references users,
	user2_id text not null constraint user_keys_users_id_fk_2 references users,
	aes_key bytea not null,
	created_at timestamp with time zone not null
);

create index user_keys_user1_id_user2_id_index on user_keys (user1_id, user2_id);
create index user_keys_user2_id_user1_id_index on user_keys (user2_id, user1_id);
`,
		},
	}
}
