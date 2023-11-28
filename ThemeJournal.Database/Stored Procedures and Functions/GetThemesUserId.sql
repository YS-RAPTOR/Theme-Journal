CREATE OR REPLACE FUNCTION Get_Themes_UserId 
(
    _UserId UUID
)
RETURNS TABLE
(
    Id UUID, 
    Title VARCHAR(255), 
    StartDate TIMESTAMP,
    EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT(Id, Title, StartDate, EndDate)
    FROM Themes
    WHERE UserId = _UserId;
END;
$$

