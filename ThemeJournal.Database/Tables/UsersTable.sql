CREATE TABLE Users(
    Id UUID PRIMARY KEY,
    Username VARCHAR(20) NOT NULL UNIQUE,
    IsEncrypting BOOLEAN DEFAULT FALSE
)
