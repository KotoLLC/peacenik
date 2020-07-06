package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0001l() *migrate.Migration {
	return &migrate.Migration{
		Id: "0001l",
		Up: []string{
			`
drop index invites_friend_email_user_id_uindex;
create index invites_friend_email_user_id_index on invites (friend_email, user_id);

drop index invites_user_id_friend_email_uindex;
create index invites_user_id_friend_email_index on invites (user_id, friend_email);`,
		},
		Down: []string{},
	}
}
