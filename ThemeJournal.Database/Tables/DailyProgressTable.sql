create table daily_progress (
    id binary(16) primary key,
    userid binary(16) not null,
    taskid binary(16) not null,
    completiondate datetime not null default current_timestamp,
    progress bit(2) not null default b'00',
    foreign key (userid) references users(id) on delete cascade,
    foreign key (taskid) references daily_tasks(id) on delete cascade
);
