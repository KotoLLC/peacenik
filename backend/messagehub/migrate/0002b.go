package migrate

import (
	migrate "github.com/rubenv/sql-migrate"
)

func migration0002b() *migrate.Migration {
	return &migrate.Migration{
		Id: "0002b",
		Up: []string{
			`
drop table comments;`,
			`
alter table messages add attachment_id text default '' not null;
alter table messages add attachment_type text default '' not null;
alter table messages add attachment_thumbnail_id text default '' not null;
alter table messages add parent_id text;

alter table messages add constraint messages_messages_id_fk foreign key (parent_id) references messages;`,
			`
create index messages_parent_id_index on messages (parent_id);
`,
			`
create table blob_pending_deletes
(
	id serial not null constraint blob_pending_deletes_pk primary key,
	blob_id text not null,
	deleted_at timestamp with time zone
);
`,
		},
		Down: []string{},
	}
}
