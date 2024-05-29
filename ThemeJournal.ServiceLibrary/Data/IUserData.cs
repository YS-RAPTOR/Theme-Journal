using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IUserData
{
    Task<List<TimeModel>> GetTime(Guid id);
    Task UpsertTime(Guid id, TimeModel newTime);
}
