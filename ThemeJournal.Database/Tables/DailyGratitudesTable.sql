create type timeofday as enum ('day1', 'day2', 'night');

create table daily_gratitudes (
    id uuid primary key,
    userid uuid not null,
    time timeofday not null,
    createdat timestamp not null default current_timestamp,
    description varchar(1024) not null,
    sentiment numeric(3, 2) check (sentiment >= -1 and sentiment <= 1) default null,
    foreign key (userid) references users(id) on delete cascade
);
