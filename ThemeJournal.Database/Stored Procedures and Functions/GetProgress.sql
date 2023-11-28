CREATE OR REPLACE FUNCTION Get_Progress
(
    _UserId UUID
    _TaskIds UUID[]
    _LowerDate TIMESTAMP,
    _UpperDate TIMESTAMP
)
RETURNS TABLE
(
    Id UUID 
    TaskID UUID 
    CompletionDate TIMESTAMP 
    Progress BIT(2) 
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT (Id, TaskID, CompletionDate, Progress)
    FROM Daily_Progress
    WHERE UserId = _UserId AND
    (_LowerDate IS NULL OR CompletionDate >= _LowerDate) AND
    (_UpperDate IS NULL OR CompletionDate <= _UpperDate) AND
    TaskID = ANY(_TaskIds);
END;
$$
