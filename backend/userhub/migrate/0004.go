package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func m0004a() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004a",
		Up: []string{
			`
create table groups
(
	id text not null constraint groups_pk primary key,
	name text not null,
	description text not null,
	admin_id text not null constraint groups_users_id_fk references users,
	avatar_original_id text default ''::text not null,
	avatar_thumbnail_id text default ''::text not null,
	is_public boolean default false not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create unique index groups_name_uindex on groups (lower(name));
`,
			`
create table group_users
(
	group_id text not null constraint group_users_groups_id_fk references groups,
	user_id text not null constraint group_users_users_id_fk references users,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null,
	constraint group_users_pk primary key (group_id, user_id)
);

create unique index group_users_user_id_group_id_uindex
	on group_users (user_id, group_id);
`,
		},
	}
}

func m0004b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004b",
		Up: []string{
			`
create table group_invites
(
	id serial not null constraint group_invites_pk primary key,
	group_id text not null constraint group_invites_groups_id_fk_group_id references groups,
	inviter_id text not null constraint group_invites_users_id_fk_inviter_id references users,
	invited_id text null constraint group_invites_users_id_fk_invited_id references users,
	invited_email text not null default '',
	created_at timestamp with time zone not null,
	accepted_at timestamp with time zone,
	rejected_at timestamp with time zone,
	auto_accepted boolean default false not null
);

create index group_invites_invited_email_inviter_id_index on group_invites (invited_email, inviter_id);
create index group_invites_inviter_id_invited_email_index on group_invites (inviter_id, invited_email);
create index group_invites_invited_id_inviter_id_index on group_invites (invited_id, inviter_id);
create index group_invites_inviter_id_invited_id_index on group_invites (inviter_id, invited_id);
`,
		},
	}
}

func m0004c() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004c",
		Up: []string{
			`
alter table group_invites add accepted_by_admin_at timestamp with time zone;
`,
		},
	}
}

func m0004d() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004d",
		Up: []string{
			`
alter table group_invites add message text not null default '';
`,
		},
	}
}

func m0004e() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004e",
		Up: []string{
			`
alter table group_invites add rejected_by_admin_at timestamp with time zone;
`,
		},
	}
}

func m0004f() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004f",
		Up: []string{
			`
alter table groups add background_id text default '' not null;
`,
		},
	}
}

func m0004g() *migrate.Migration {
	return &migrate.Migration{
		Id: "0004g",
		Up: []string{
			`
alter table message_hubs add allow_friend_groups boolean default false not null;
`,
		},
	}
}
