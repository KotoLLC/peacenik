package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002g() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002g",
		Up: []string{
			`
create table user_nodes
(
	user_id text not null
		constraint user_nodes_users_id_fk references users,
	node_id text not null
		constraint user_nodes_nodes_id_fk references nodes,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null,
	constraint user_nodes_pk primary key (user_id, node_id)
);
`,
		},
		Down: []string{},
	}
}
