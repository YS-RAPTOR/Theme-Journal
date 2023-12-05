CREATE OR REPLACE PROCEDURE Create_Theme(
    _UserId UUID,
    _Id UUID,
    _Title VARCHAR(255),
    _StartDate TIMESTAMP,
    _EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Themes (Id, UserId, Title, StartDate, EndDate)
    VALUES (_Id, _UserId, _Title, _StartDate, _EndDate)
END;
$$

