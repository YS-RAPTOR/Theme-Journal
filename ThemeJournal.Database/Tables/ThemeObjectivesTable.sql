create table theme_objectives (
    id binary(16) primary key,
    userid binary(16) not null,
    themeid binary(16) not null,
    description varchar(255) not null,
    colorid integer not null default 0,
    foreign key(userid) references users(id) on delete cascade,
    foreign key(themeid) references themes(id) on delete cascade
);
