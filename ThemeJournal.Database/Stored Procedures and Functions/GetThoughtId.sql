CREATE OR REPLACE FUNCTION Get_Thought_Id
(
    _Id UUID,
    _UserId UUID
)
RETURNS TABLE
(
    CreatedAt TIMESTAMP,
    Thought VARCHAR(2047)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (CreatedAt, Thought)
    FROM Daily_Thoughts
    WHERE UserId = _UserID AND Id = _Id;
END;
$$
