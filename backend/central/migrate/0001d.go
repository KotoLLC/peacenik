package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001d() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001d",
		Up: []string{
			`
create table relations_dg_tmp
(
	id integer not null constraint invites_pk primary key autoincrement,
	user1_id text not null,
	user2_email text not null,
	community text not null,
	created_at text not null,
	accepted_at text default '' not null
);

insert into relations_dg_tmp(id, user1_id, user2_email, community, created_at, accepted_at) select id, user1_id, user2_id, community, created_at, accepted_at from relations;

drop table relations;

alter table relations_dg_tmp rename to invites;

create unique index invites_user1_id_user2_email_community_uindex on invites (user1_id, user2_email, community);
create unique index invites_user2_email_user1_id_community_uindex on invites (user2_email, user1_id, community);`,
			`
create table relations
(
	user1_id text not null,
	user2_id text not null,
	community text not null,
	constraint relations_pk primary key (user1_id, user2_id, community)
);`,
		},
		Down: []string{},
	}
}
