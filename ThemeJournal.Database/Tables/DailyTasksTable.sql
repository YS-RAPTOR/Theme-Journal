create table daily_tasks (
    id uuid primary key,
    userid uuid not null,
    objectiveid uuid,
    description varchar(255) not null,
    partialcompletion varchar(255) not null,
    fullcompletion varchar(255) not null,
    startdate timestamp not null default current_timestamp,
    enddate timestamp not null,
    foreign key (userid) references users(id) on delete cascade,
    foreign key (objectiveid) references theme_objectives(id) on delete set null
);
