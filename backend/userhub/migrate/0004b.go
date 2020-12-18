package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0004b() *migrate.Migration {
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
		Down: []string{},
	}
}
