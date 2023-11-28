CREATE OR REPLACE FUNCTION Get_Objective_ThemeId
(
    _UserId UUID,
    _ThemeId UUID
)
RETURNS TABLE
(
    Id UUID,
    Description VARCHAR(255),
    ColorId INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT (Id, Description, ColorId)
    FROM Theme_Objectives
    WHERE UserId = _UserId AND
    ThemeId = _ThemeId;
END;
$$

