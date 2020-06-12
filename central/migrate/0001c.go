package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001c",
		Up: []string{
			`
create table relations
(
	id integer not null constraint relations_pk primary key autoincrement,
	user1_id text not null,
	user2_id text not null,
    community text not null,
	created_at text not null,
	accepted_at text not null default ''
);

create unique index relations_user1_id_user2_id_community_uindex on relations (user1_id, user2_id, community);
create unique index relations_user2_id_user1_id_community_uindex on relations (user2_id, user1_id, community);
`,
		},
		Down: []string{},
	}
}
