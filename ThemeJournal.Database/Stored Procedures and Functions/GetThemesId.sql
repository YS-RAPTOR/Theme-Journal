CREATE OR REPLACE FUNCTION Get_Themes_Id 
(
    _Id UUID,
    _UserId UUID
)
RETURNS TABLE
(
    Title VARCHAR(255), 
    StartDate TIMESTAMP, 
    EndDate TIMESTAMP 
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT(Title, StartDate, EndDate)
    FROM Themes
    WHERE UserId = _UserId AND Id = _Id;
END;
$$

