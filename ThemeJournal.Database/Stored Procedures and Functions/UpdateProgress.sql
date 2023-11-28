CREATE OR REPLACE PROCEDURE Update_Progress
(
    _Id UUID,
    _UserId UUID,
    _Progress BIT(2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Daily_Progress
    SET Progress = _Progress
    WHERE Id = _Id AND UserId = _UserId;
END;
$$

