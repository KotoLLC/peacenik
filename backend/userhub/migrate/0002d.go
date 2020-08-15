package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002d() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002d",
		Up: []string{
			`
alter table invites add friend_id text;
alter table invites add constraint invites_users_id_fk_friend_id foreign key (friend_id) references users;
create index invites_friend_id_user_id_index on invites (friend_id, user_id);
create index invites_user_id_friend_id_index on invites (user_id, friend_id);
`,
			`
update invites
set friend_id = (select id from users where email = invites.friend_email)
where friend_id is null and friend_email <> '';
`,
		},
		Down: []string{},
	}
}
