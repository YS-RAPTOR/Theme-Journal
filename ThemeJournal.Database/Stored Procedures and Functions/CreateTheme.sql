CREATE OR REPLACE PROCEDURE Create_Theme(
    UserId UUID,
    Title VARCHAR(255),
    StartDate TIMESTAMP,
    EndDate TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Themes (UserId, Title, StartDate, EndDate)
    VALUES (UserId, Title, StartDate, EndDate);
END;
$$

