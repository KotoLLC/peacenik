package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001h() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001h",
		Up: []string{
			`
create table nodes_dg_tmp
(
	id text not null constraint nodes_pk primary key,
	address text not null,
	admin_id text not null,
	created_at text not null,
	approved_at text not null,
	disabled_at text not null
);

insert into nodes_dg_tmp(id, address, admin_id, created_at, approved_at, disabled_at)
select id, address, (select id from users where email = nodes.admin_email), created_at, '', disabled_at
from nodes;

drop table nodes;

alter table nodes_dg_tmp rename to nodes;

create unique index nodes_address_uindex on nodes (address);`,
		},
		Down: []string{},
	}
}
