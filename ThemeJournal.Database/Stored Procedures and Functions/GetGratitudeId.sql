CREATE OR REPLACE FUNCTION Get_Gratitude_Id
(
    _UserId UUID,
    _Id UUID
)
RETURNS TABLE
(
    CreatedAt TIMESTAMP,
    Description VARCHAR(1024),
    Sentiment NUMERIC(3, 2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (CreatedAt, Description, Sentiment)
    FROM Daily_Gratitudes 
    WHERE UserId = _UserID AND Id = _Id;
END;
$$
