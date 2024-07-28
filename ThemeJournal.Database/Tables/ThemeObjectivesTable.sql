create table theme_objectives (
    id uuid primary key,
    userid uuid not null,
    themeid uuid not null,
    description varchar(255) not null,
    colorid integer not null default 0,
    foreign key(userid) references users(id) on delete cascade,
    foreign key(themeid) references themes(id) on delete cascade
);
