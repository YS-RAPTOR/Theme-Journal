CREATE OR REPLACE PROCEDURE Upsert_Gratitude
(
    _Id UUID,
    _UserId UUID,
    _Description VARCHAR(1024),
    _Sentiment NUMERIC(3, 2),
    _CreatedAt TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Daily_Gratitudes (Id, UserId, Description, Sentiment, CreatedAt)
    VALUES (_Id, _UserId, _Description, _Sentiment, _CreatedAt)
    ON CONFLICT (Id)
    DO UPDATE SET Description = _Description, Sentiment = _Sentiment;
END;
$$
