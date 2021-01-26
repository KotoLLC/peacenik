package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0002a() *migrate.Migration {
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
	}
}

func m0002b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002b",
		Up: []string{
			`
alter table users add confirmed_at timestamp with time zone;`,
		},
	}
}

func m0002c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002c",
		Up: []string{
			`
create table blob_pending_deletes
(
	id serial not null constraint blob_pending_deletes_pk primary key,
	blob_id text not null,
	deleted_at timestamp with time zone
);
`,
		},
	}
}

func m0002d() *migrate.Migration {
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
	}
}

func m0002e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002e",
		Up: []string{
			`
create table notifications
(
	id text not null constraint notifications_pk primary key,
	user_id text not null constraint notifications_users_id_fk_user_id references users,
	text text not null,
	type text not null,
	data json not null,
	created_at timestamp with time zone not null,
	read_at timestamp with time zone
);
`,
		},
	}
}

func m0002f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002f",
		Up: []string{
			`
alter table nodes add post_limit int default 0 not null;
`,
		},
	}
}

func m0002g() *migrate.Migration {
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
	}
}

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
	}
}

func m0002i() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002i",
		Up: []string{
			`
drop index users_name_uindex;
create unique index "users_name_uindex" on users ((lower(name)));
`,
		},
	}
}

func m0002j() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002j",
		Up: []string{
			`
drop index users_email_uindex;
`,
		},
	}
}

func m0002k() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002k",
		Up: []string{
			`
create table fcm_tokens
(
	user_id text not null constraint fcm_tokens_users_id_fk references users,
	token text not null,
	device_id text not null,
	created_at timestamp with time zone not null,
	constraint fcm_tokens_pk primary key (user_id, token)
);
`,
		},
	}
}

func m0002l() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002l",
		Up: []string{
			`
alter table fcm_tokens add os text default '' not null;
`,
		},
	}
}

func m0002m() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002m",
		Up: []string{
			`
alter table invites add auto_accepted boolean default false not null;
`,
		},
	}
}

func m0002n() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002n",
		Up: []string{
			`
alter table fcm_tokens add updated_at timestamp with time zone;
alter table fcm_tokens add deleted_at timestamp with time zone;`,
			`
update fcm_tokens set updated_at = created_at;
`,
			`
alter table fcm_tokens alter updated_at set not null;
`,
		},
	}
}

func m0002o() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002o",
		Up: []string{
			`
alter table user_message_hubs add blocked_at timestamp with time zone;`,
		},
	}
}

func m0002p() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002p",
		Up: []string{
			`
create table blocked_users
(
	user_id text not null constraint blocked_users_users_id_fk references users,
	blocked_user_id text not null constraint blocked_users_users_id_fk_2 references users,
	created_at timestamp with time zone not null,
	constraint blocked_users_pk primary key (user_id, blocked_user_id)
);`,
		},
	}
}
