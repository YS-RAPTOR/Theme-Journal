CREATE OR REPLACE PROCEDURE Update_Objective
(
    _Id UUID,
    _UserId UUID,
    _ColorId INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Theme_Objectives
    SET ColorId = _ColorId
    WHERE Id = _Id AND UserId = _UserId;
END;
$$

