CREATE OR REPLACE PROCEDURE Create_Progress
(
    _Id UUID[],
    _UserId UUID,
    _TaskId UUID,
    _CompletionDate TIMESTAMP[],
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Daily_Progress (Id, CompletionDate, UserId, TaskId,)
    SELECT UNNEST(_Id, _CompletionDate), _UserId, _TaskId;
END;
$$

