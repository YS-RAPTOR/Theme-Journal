using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class ThemeData : IThemeData
{
    private readonly IDataAccess _sql;

    public ThemeData(IDataAccess sql)
    {
        _sql = sql;
    }

    public void CreateTheme(Guid userId, PostThemeModel theme)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", theme.Id);
        parameters.Add("_Title", theme.Title);
        parameters.Add("_StartDate", theme.StartDate);
        parameters.Add("_EndDate", theme.EndDate);

        _sql.SaveData("Create_Theme", parameters);
    }

    public void UpdateTheme(Guid userId, Guid id, ThemeModel theme)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_Title", theme.Title);
        parameters.Add("_StartDate", theme.StartDate);
        parameters.Add("_EndDate", theme.EndDate);
        _sql.SaveData("Update_Theme", parameters);
    }

    public void ExtendTheme(Guid userId, Guid id, DateTime endDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_EndDate", endDate);
        _sql.SaveData("Extend_Theme", parameters);
    }

    public List<ThemeModel> GetThemeByID(Guid userId, Guid themeId)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_ThemeId", themeId);
        var output = _sql.LoadData<ThemeModel, dynamic>("Get_Theme_Id", parameters);
        return output;
    }

    public List<GetThemeModel> GetThemes(Guid userId)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        var output = _sql.LoadData<GetThemeModel, dynamic>("Get_Themes_UserId", parameters);
        return output;
    }
}
