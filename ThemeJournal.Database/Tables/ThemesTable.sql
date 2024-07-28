create table themes(
    id uuid primary key,
    userid uuid not null,
    title varchar(255) not null,
    startdate timestamp not null default current_timestamp,
    enddate timestamp not null,
    foreign key(userid) references users(id) on delete cascade
);
