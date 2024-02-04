create table daily_thoughts (
    id binary(16) primary key,
    userid binary(16) not null,
    createdat datetime not null default current_timestamp,
    thought varchar(2047) not null,
    foreign key (userid) references users(id) on delete cascade
);
