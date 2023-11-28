CREATE OR REPLACE PROCEDURE Create_Task
(
    _Id UUID  
    _UserId UUID 
    _ObjectiveID UUID 
    _Description VARCHAR(255) 
    _PartialCompletion VARCHAR(255) 
    _FullCompletion VARCHAR(255) 
    _StartDate TIMESTAMP 
    _EndDate TIMESTAMP 
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Daily_Tasks (Id, UserId, ObjectiveID, Description, PartialCompletion, FullCompletion, StartDate, EndDate)
    VALUES (_Id, _UserId, _ObjectiveID, _Description, _PartialCompletion, _FullCompletion, _StartDate, _EndDate);
END;
$$

