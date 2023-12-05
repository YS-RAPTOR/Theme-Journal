CREATE OR REPLACE FUNCTION Get_Thoughts
(
    _UserId UUID,
    _LowerDate TIMESTAMP,
    _UpperDate TIMESTAMP
)
RETURNS TABLE
(
    Id UUID,
    CreatedAt TIMESTAMP,
    Thought VARCHAR(2047)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (Id, CreatedAt, Thought)
    FROM Daily_Thoughts 
    WHERE UserId = _UserId AND 
    (CreatedAt >= _LowerDate OR _LowerDate IS NOT NULL) AND 
    (CreatedAt <= _UpperDate OR _UpperDate IS NOT NULL)
END;
$$
