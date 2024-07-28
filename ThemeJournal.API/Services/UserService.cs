using ThemeJournal.ServiceLibrary.Data;

namespace ThemeJournal.Api.Services;

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserData _userData;

    public UserService(IHttpContextAccessor httpContextAccessor, IUserData userData)
    {
        _httpContextAccessor = httpContextAccessor;
        _userData = userData;
    }

    public Guid GetUserId()
    {
        if (_httpContextAccessor.HttpContext == null)
        {
            return Guid.Empty;
        }
        var userId = _httpContextAccessor
            .HttpContext.User.Claims.First(c =>
                c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier"
            )
            .Value;
        return Guid.Parse(userId);
    }

    public async Task<TimeOnly> GetUserDayStartTime()
    {
        var userId = GetUserId();
        var time = await _userData.GetTime(userId);

        if (time.Count == 0)
        {
            return new TimeOnly(0, 0, 0);
        }

        return new TimeOnly(time[0].Hours, time[0].Minutes, 0);
    }

    public async Task<DateTime> TrasformDate(DateTime date, bool subtract = true)
    {
        var userDayStartTime = await GetUserDayStartTime();

        var transformedDate = new DateTime(
            date.Year,
            date.Month,
            date.Day,
            userDayStartTime.Hour,
            userDayStartTime.Minute,
            userDayStartTime.Second,
            DateTimeKind.Utc
        );

        if (transformedDate > date && subtract)
        {
            transformedDate = transformedDate.AddDays(-1);
        }

        return transformedDate;
    }
}
