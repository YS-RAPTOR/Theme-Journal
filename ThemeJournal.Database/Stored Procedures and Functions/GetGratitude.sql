CREATE OR REPLACE FUNCTION Get_Gratitude
(
    _UserId UUID,
    _Sentiment NUMERIC(3, 2)
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
    (CreatedAt >= _LowerDate OR _LowerDate IS NOT NULL) AND
    (CreatedAt <= _UpperDate OR _UpperDate IS NOT NULL) AND
    (Sentiment >= _Sentiment OR _Sentiment IS NOT NULL);
END;
$$
