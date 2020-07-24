package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002a",
		Up: []string{
			`
create table users
(
	id text not null constraint users_pk primary key,
	name text not null,
	email text not null,
	password_hash text not null,
	avatar_original_id text default '' not null,
	avatar_thumbnail_id text default '' not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create unique index users_email_uindex on users (email);
create unique index users_name_uindex on users (name);
`,
			`
create table friends
(
	user_id text not null constraint friends_users_id_fk_user_id references users (id),
	friend_id text not null constraint friends_users_id_fk_friend_id references users (id),
	constraint friends_pk primary key (user_id, friend_id)
);
`,
			`
create table invites
(
	id serial not null constraint invites_pk primary key,
	user_id text not null constraint invites_users_id_fk_user_id references users (id),
	friend_email text not null,
	created_at timestamp with time zone not null,
	accepted_at timestamp with time zone,
	rejected_at timestamp with time zone
);

create index invites_friend_email_user_id_index on invites (friend_email, user_id);
create index invites_user_id_friend_email_index on invites (user_id, friend_email);
`,
			`
create table nodes
(
	id text not null constraint nodes_pk primary key,
	address text not null,
	admin_id text not null constraint nodes_users_id_fk_admin_id references users (id),
	details text not null,
	created_at timestamp with time zone not null,
	approved_at timestamp with time zone,
	disabled_at timestamp with time zone
);

create unique index nodes_address_uindex on nodes (address);
`,
		},
		Down: []string{},
	}
}
