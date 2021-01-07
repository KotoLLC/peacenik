package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002h() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002h",
		Up: []string{
			`
alter index nodes_address_uindex rename to message_hubs_address_uindex;
alter table nodes rename constraint nodes_pk to message_hubs_pk;
alter table nodes rename constraint nodes_users_id_fk_admin_id to message_hubs_users_id_fk_admin_id;
alter table nodes rename to message_hubs;`,
			`
alter table user_nodes rename column node_id to hub_id;
alter table user_nodes rename constraint user_nodes_pk to user_message_hubs_pk;
alter table user_nodes rename constraint user_nodes_users_id_fk to user_message_hubs_users_id_fk;
alter table user_nodes rename constraint user_nodes_nodes_id_fk to user_message_hubs_message_hubs_id_fk;
alter table user_nodes rename to user_message_hubs;`,
		},
		Down: []string{},
	}
}
