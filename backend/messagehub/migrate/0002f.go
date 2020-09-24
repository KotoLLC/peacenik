package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002f",
		Up: []string{
			`
create table message_reports
(
	id text not null constraint message_reports_pk primary key,
	user_id text not null constraint message_reports_users_id_fk references users,
	message_id text not null constraint message_reports_messages_id_fk references messages,
	report text not null,
	created_at timestamp with time zone not null,
	resolved_at timestamp with time zone,
	message_deleted_at timestamp with time zone,
	user_ejected_at timestamp with time zone
);
`,
			`
alter table messages add deleted_at timestamp with time zone;
`,
			`
alter table users add added_at timestamp with time zone default now() not null;
alter table users add blocked_at timestamp with time zone;`,
		},
		Down: []string{},
	}
}
