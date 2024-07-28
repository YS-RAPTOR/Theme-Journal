create table daily_progress (
    id uuid primary key,
    userid uuid not null,
    taskid uuid not null,
    completiondate timestamp not null default current_timestamp,
    progress bit(2) not null default b'00',
    foreign key (userid) references users(id) on delete cascade,
    foreign key (taskid) references daily_tasks(id) on delete cascade
);
