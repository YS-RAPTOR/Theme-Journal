CREATE OR REPLACE PROCEDURE Delete_Objective
(
    _Id UUID,
    _UserId UUID,
    _ThemeId UUID,
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Theme_Objectives
    WHERE Id = _Id AND UserId = _UserId AND ThemeId = _ThemeId;
END;
$$
