CREATE OR REPLACE FUNCTION Get_Thoughts_UserId
(
    _UserId UUID
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
    WHERE UserId = _UserId;
END;
$$
