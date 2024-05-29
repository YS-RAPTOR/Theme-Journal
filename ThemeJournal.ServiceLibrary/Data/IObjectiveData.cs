using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IObjectiveData
{
    Task CreateObjective(Guid userId, Guid themeId, List<ObjectiveModel> objectives);
    Task<List<ObjectiveModel>> GetObjectiveByThemeId(Guid userId, Guid themeId);
    Task UpdateObjective(Guid userId, Guid id, int colorId);
    Task DeleteObjective(Guid userId, Guid themeId, Guid id);
}
