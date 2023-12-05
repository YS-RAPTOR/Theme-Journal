CREATE OR REPLACE FUNCTION Get_Tasks
(
    _UserId UUID,
    _UpperDate TIMESTAMP
)
RETURNS TABLE
(
    TaskId UUID, 
    ObjectiveDescription VARCHAR(255), 
    ObjectiveColor INTEGER, 
    Description VARCHAR(255), 
    PartialCompletion VARCHAR(255),
    FullCompletion VARCHAR(255), 
    StartDate TIMESTAMP,
    EndDate TIMESTAMP 
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT(Daily_Tasks.Id, Theme_Objectives.Description, Theme_Objectives.Color, Daily_Tasks.Description, Daily_Tasks.PartialCompletion, Daily_Tasks.FullCompletion, Daily_Tasks.StartDate, Daily_Tasks.EndDate)
    FROM Daily_Tasks
    LEFT JOIN Theme_Objectives ON Daily_Tasks.ObjectiveID = Theme_Objectives.Id
    WHERE Daily_Tasks.UserId = _UserId AND
    (Daily_Tasks.StartDate <= _UpperDate OR _UpperDate IS NULL)
END;
$$

