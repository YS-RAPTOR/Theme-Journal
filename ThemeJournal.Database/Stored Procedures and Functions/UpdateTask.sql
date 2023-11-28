CREATE OR REPLACE PROCEDURE Update_Task
(
    _Id UUID, 
    _UserId UUID,
    _ObjectiveID UUID,
    _Description VARCHAR(255),
    _PartialCompletion VARCHAR(255),
    _FullCompletion VARCHAR(255),
    _StartDate TIMESTAMP,
    _EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Daily_Tasks
    SET ObjectiveID = _ObjectiveID, Description = _Description, PartialCompletion = _PartialCompletion, FullCompletion = _FullCompletion, StartDate = _StartDate, EndDate = _EndDate
    WHERE Id = _Id and UserId = _UserId;
END;
$$
