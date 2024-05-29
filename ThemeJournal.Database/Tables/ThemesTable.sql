create table themes(
    id binary(16) primary key,
    userid binary(16) not null,
    title varchar(255) not null,
    startdate datetime not null default current_timestamp,
    enddate datetime not null,
    foreign key(userid) references users(id) on delete cascade
);
