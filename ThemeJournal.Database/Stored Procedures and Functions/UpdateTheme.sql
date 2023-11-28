CREATE OR REPLACE PROCEDURE Update_Theme(
    _Id UUID,
    _UserId UUID,
    _Title VARCHAR(255),
    _StartDate TIMESTAMP,
    _EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Themes
    SET Title = _Title, StartDate = _StartDate, EndDate = _EndDate
    WHERE Id = _Id AND UserId = _UserId;
END;
$$
