using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class ObjectiveData : IObjectiveData
{
    private readonly IDataAccess _sql;

    public ObjectiveData(IDataAccess sql)
    {
        _sql = sql;
    }

    public void CreateObjective(Guid userId, Guid themeId, List<ObjectiveModel> objectives)
    {
        List<Guid> ids = new(objectives.Count);
        List<string> descriptions = new(objectives.Count);
        List<int> colorIds = new(objectives.Count);

        foreach (var objective in objectives)
        {
            ids.Add(objective.Id);
            descriptions.Add(objective.Description);
            colorIds.Add(objective.ColorId);
        }

        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_ThemeId", themeId);
        parameters.Add("_Id", ids);
        parameters.Add("_Description", descriptions);
        parameters.Add("_ColorId", colorIds);

        _sql.SaveData("Create_Objective", parameters);
    }

    public List<ObjectiveModel> GetObjectiveByThemeId(Guid userId, Guid themeId)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_ThemeId", themeId);

        var output = _sql.LoadData<ObjectiveModel, dynamic>("Get_Objective_ThemeId", parameters);
        return output;
    }

    public void UpdateObjective(Guid userId, Guid id, int colorId)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_ColorId", colorId);

        _sql.SaveData("Update_Objective", parameters);
    }

    public void DeleteObjective(Guid userId, Guid themeId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_ThemeId", themeId);
        _sql.SaveData("Delete_Objective", parameters);
    }
}
