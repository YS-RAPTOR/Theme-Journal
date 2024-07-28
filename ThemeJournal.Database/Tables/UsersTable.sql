create table users(
    id uuid primary key,
    hours smallint not null default 0, 
    minutes smallint not null default 0
);
