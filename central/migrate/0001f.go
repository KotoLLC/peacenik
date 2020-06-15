package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001f",
		Up: []string{
			`
create table nodes
(
	id text not null constraint nodes_pk primary key,
	address text not null,
	admin_email text not null,
	created_at text not null,
	disabled_at text not null
);`,
			`
create table user_nodes
(
	id integer not null constraint user_nodes_pk primary key autoincrement,
	user_id text not null,
	node_id text not null,
	created_at text not null,
	disabled_at text not null
);

create unique index user_nodes_user_id_node_id_uindex on user_nodes (user_id, node_id);`,
			`
create table invites_dg_tmp
(
	id integer not null constraint invites_pk primary key autoincrement,
	user_id text not null,
	friend_email text not null,
	created_at text not null,
	accepted_at text not null
);

insert into invites_dg_tmp(id, user_id, friend_email, created_at, accepted_at) select id, user_id, friend_email, created_at, accepted_at from invites;

drop table invites;

alter table invites_dg_tmp rename to invites;

create unique index invites_user_id_friend_email_uindex on invites (user_id, friend_email);
create unique index invites_friend_email_user_id_uindex on invites (friend_email, user_id);
`,
			`
create table friends_dg_tmp
(
	user_id text not null,
	friend_id text not null,
	constraint friends_pk primary key (user_id, friend_id)
);

insert into friends_dg_tmp(user_id, friend_id) select user_id, friend_id from relations;

drop table relations;

alter table friends_dg_tmp rename to friends;
`,
		},
		Down: []string{},
	}
}
