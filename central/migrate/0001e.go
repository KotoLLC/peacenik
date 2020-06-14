package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001e",
		Up: []string{
			`
create table invites_dg_tmp
(
	id integer not null constraint invites_pk primary key autoincrement,
	user_id text not null,
	friend_email text not null,
	community text not null,
	created_at text not null,
	accepted_at text default '' not null
);

insert into invites_dg_tmp(id, user_id, friend_email, community, created_at, accepted_at) select id, user1_id, user2_email, community, created_at, accepted_at from invites;

drop table invites;

alter table invites_dg_tmp rename to invites;

create unique index invites_user_id_friend_email_community_uindex
	on invites (user_id, friend_email, community);

create unique index invites_friend_email_user_id_community_uindex
	on invites (friend_email, user_id, community);
`,
			`
create table relations_dg_tmp
(
	user_id text not null,
	friend_id text not null,
	community text not null,
	constraint relations_pk
		primary key (user_id, friend_id, community)
);

insert into relations_dg_tmp(user_id, friend_id, community) select user1_id, user2_id, community from relations;

drop table relations;

alter table relations_dg_tmp rename to relations;`,
		},
		Down: []string{},
	}
}
