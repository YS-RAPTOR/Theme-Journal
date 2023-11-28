CREATE OR REPLACE PROCEDURE Extend_Theme
(
    _Id UUID,
    _UserId UUID,
    _EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Themes
    SET EndDate = _EndDate
    WHERE Id = _Id AND UserId = _UserId;
END;
$$


