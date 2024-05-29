create table daily_tasks (
    id binary(16) primary key,
    userid binary(16) not null,
    objectiveid binary(16),
    description varchar(255) not null,
    partialcompletion varchar(255) not null,
    fullcompletion varchar(255) not null,
    startdate datetime not null default current_timestamp,
    enddate datetime not null,
    foreign key (userid) references users(id) on delete cascade,
    foreign key (objectiveid) references theme_objectives(id) on delete set null
);
