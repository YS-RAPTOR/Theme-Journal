CREATE OR REPLACE FUNCTION Get_Gratitude_Date
(
    _UserId UUID,
    _LowerDate TIMESTAMP,
    _UpperDate TIMESTAMP
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
    WHERE UserId = _UserID AND
    CreatedAt >= _LowerDate AND
    CreatedAt <= _UpperDate;
END;
$$
