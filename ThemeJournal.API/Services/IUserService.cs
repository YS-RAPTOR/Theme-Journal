namespace ThemeJournal.Api.Services;

public interface IUserService
{
    Guid GetUserId();
    TimeOnly GetUserDayStartTime();
    DateTime TrasformDate(DateTime date);
}
