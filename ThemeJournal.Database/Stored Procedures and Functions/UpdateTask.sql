CREATE OR REPLACE PROCEDURE Update_Task
(
    _Id UUID  
    _UserId UUID 
    ObjectiveID UUID 
    Description VARCHAR(255) 
    PartialCompletion VARCHAR(255) 
    FullCompletion VARCHAR(255) 
    StartDate TIMESTAMP 
    _EndDate TIMESTAMP 
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Daily_Tasks
    SET ObjectiveID = ObjectiveID, Description = Description, PartialCompletion = PartialCompletion, FullCompletion = FullCompletion, StartDate = StartDate, EndDate = _EndDate
    WHERE Id = _Id and UserId = _UserId;
END;
$$
