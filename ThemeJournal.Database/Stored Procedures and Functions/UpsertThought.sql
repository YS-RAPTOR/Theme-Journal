CREATE OR REPLACE PROCEDURE Upsert_Gratitude
(
    _Id UUID,
    _UserId UUID,
    _Thought VARCHAR(2047),
    _CreatedAt TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Daily_Thoughts (Id, UserId, Thought, CreatedAt)
    VALUES (_Id, _UserId, _Thought, CreatedAt)
    ON CONFLICT (Id) DO UPDATE
    SET Thought = _Thought;
END;
$$
