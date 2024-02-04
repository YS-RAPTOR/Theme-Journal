create table users(
    id binary(16) primary key,
    hours smallint not null default 0, 
    minutes smallint not null default 0
);
