create table daily_thoughts (
    id uuid primary key,
    userid uuid not null,
    createdat timestamp not null default current_timestamp,
    thought varchar(2047) not null,
    foreign key (userid) references users(id) on delete cascade
);
