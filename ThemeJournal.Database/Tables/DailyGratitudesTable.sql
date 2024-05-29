create table daily_gratitudes (
    id binary(16) primary key,
    userid binary(16) not null,
    time enum ('day1', 'day2', 'night') not null,
    createdat datetime not null default current_timestamp,
    description varchar(1024) not null,
    sentiment numeric(3, 2) check (sentiment >= -1 and sentiment <= 1) default null,
    foreign key (userid) references users(id) on delete cascade
);
