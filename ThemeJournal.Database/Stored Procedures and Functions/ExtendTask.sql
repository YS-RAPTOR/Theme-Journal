CREATE OR REPLACE PROCEDURE Update_Task
(
    _Id UUID  
    _UserId UUID 
    _EndDate TIMESTAMP 
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Daily_Tasks
    SET EndDate = _EndDate
    WHERE Id = _Id and UserId = _UserId;
END;
$$
