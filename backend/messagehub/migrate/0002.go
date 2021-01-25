package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002a",
		Up: []string{
			`
create table messages
(
	id text not null constraint messages_pk primary key,
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create index messages_user_id_index on messages (user_id);
`,
			`
create table comments
(
	id text not null constraint comments_pk primary key,
	message_id text not null constraint comments_messages_id_fk_message_id references messages (id),
	user_id text not null,
	user_name text not null,
	text text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create index comments_message_id_index on comments (message_id);
`,
		},
	}
}

func m0002b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002b",
		Up: []string{
			`
drop table comments;`,
			`
alter table messages add attachment_id text default '' not null;
alter table messages add attachment_type text default '' not null;
alter table messages add attachment_thumbnail_id text default '' not null;
alter table messages add parent_id text;

alter table messages add constraint messages_messages_id_fk foreign key (parent_id) references messages;`,
			`
create index messages_parent_id_index on messages (parent_id);
`,
			`
create table blob_pending_deletes
(
	id serial not null constraint blob_pending_deletes_pk primary key,
	blob_id text not null,
	deleted_at timestamp with time zone
);
`,
		},
	}
}

func m0002c() *migrate.Migration {
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
	}
}

func m0002d() *migrate.Migration {
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
	}
}

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
	}
}

func m0002f() *migrate.Migration {
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
	}
}
