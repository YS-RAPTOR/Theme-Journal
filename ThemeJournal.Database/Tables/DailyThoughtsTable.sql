CREATE TABLE Daily_Thoughts (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(Id) ON DELETE CASCADE NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Thought VARCHAR(2047) NOT NULL
);
