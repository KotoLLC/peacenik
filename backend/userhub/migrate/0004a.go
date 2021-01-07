package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0004a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004a",
		Up: []string{
			`
create table groups
(
	id text not null constraint groups_pk primary key,
	name text not null,
	description text not null,
	admin_id text not null constraint groups_users_id_fk references users,
	avatar_original_id text default ''::text not null,
	avatar_thumbnail_id text default ''::text not null,
	is_public boolean default false not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create unique index groups_name_uindex on groups (lower(name));
`,
			`
create table group_users
(
	group_id text not null constraint group_users_groups_id_fk references groups,
	user_id text not null constraint group_users_users_id_fk references users,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null,
	constraint group_users_pk primary key (group_id, user_id)
);

create unique index group_users_user_id_group_id_uindex
	on group_users (user_id, group_id);
`,
		},
		Down: []string{},
	}
}
