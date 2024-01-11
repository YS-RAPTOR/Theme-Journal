namespace ThemeJournal.Api.Services;

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetUserId()
    {
        if (_httpContextAccessor.HttpContext == null)
        {
            return Guid.Empty;
        }
        var userId = _httpContextAccessor
            .HttpContext
            .User
            .Claims
            .First(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier")
            .Value;
        return Guid.Parse(userId);
    }

    public TimeOnly GetUserDayStartTime()
    {
        return new TimeOnly(3, 0, 0);
    }

    public DateTime TrasformDate(DateTime date)
    {
        var userDayStartTime = GetUserDayStartTime();

        return new DateTime(
            date.Year,
            date.Month,
            date.Day,
            userDayStartTime.Hour,
            userDayStartTime.Minute,
            userDayStartTime.Second,
            DateTimeKind.Utc
        );
    }
}
