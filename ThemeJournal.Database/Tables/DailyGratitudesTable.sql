CREATE TABLE DailyGratitudes (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(Id) ON DELETE CASCADE NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Description VARCHAR(1024) NOT NULL,
    Sentiment numeric(3, 2) CHECK (Sentiment >= -1 AND Sentiment <= 1) NOT NULL
);
