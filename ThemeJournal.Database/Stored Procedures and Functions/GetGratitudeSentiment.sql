CREATE OR REPLACE FUNCTION Get_Gratitude_Sentiment
(
    _UserId UUID,
    _Sentiment NUMERIC(3, 2)
)
RETURNS TABLE
(
    Id UUID,
    CreatedAt TIMESTAMP,
    Description VARCHAR(1024),
    Sentiment NUMERIC(3, 2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (Id, CreatedAt, Description, Sentiment)
    FROM Daily_Gratitudes 
    WHERE UserId = _UserID AND Sentiment >= _Sentiment;
END;
$$
