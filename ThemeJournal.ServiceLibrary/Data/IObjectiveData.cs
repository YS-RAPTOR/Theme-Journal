using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IObjectiveData
{
    void CreateObjective(Guid userId, Guid themeId, List<ObjectiveModel> objectives);
    List<ObjectiveModel> GetObjectiveByThemeId(Guid userId, Guid themeId);
    void UpdateObjective(Guid userId, Guid id, int colorId);
    void DeleteObjective(Guid userId, Guid themeId, Guid id);
}
