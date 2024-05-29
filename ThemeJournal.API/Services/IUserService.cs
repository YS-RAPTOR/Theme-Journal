namespace ThemeJournal.Api.Services;

public interface IUserService
{
    Guid GetUserId();
    Task<TimeOnly> GetUserDayStartTime();
    Task<DateTime> TrasformDate(DateTime date, bool subtract = true);
}
