CREATE TYPE TimeOfDay AS ENUM ('Day1', 'Day2', 'Night');

CREATE TABLE Daily_Gratitudes (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(Id) ON DELETE CASCADE NOT NULL,
    Time TimeOfDay NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Description VARCHAR(1024) NOT NULL,
    Sentiment NUMERIC(3, 2) CHECK (Sentiment >= -1 AND Sentiment <= 1) DEFAULT NULL
);
