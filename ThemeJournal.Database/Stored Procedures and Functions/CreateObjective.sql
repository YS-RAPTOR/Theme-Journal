CREATE OR REPLACE PROCEDURE Create_Objective
(
    _Id UUID[],
    _UserId UUID,
    _ThemeId UUID,
    _Description VARCHAR(255)[]
    _ColorId INTEGER[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Theme_Objectives (Id, Description, ColorId, UserId, ThemeId)
    SELECT UNNEST(_Id, _Description, _ColorId), _UserId, ThemeId;
END;
$$

