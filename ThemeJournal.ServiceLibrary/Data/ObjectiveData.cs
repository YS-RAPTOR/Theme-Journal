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

    public async Task CreateObjective(Guid userId, Guid themeId, List<ObjectiveModel> objectives)
    {
        List<Task> tasks = new();
        foreach (var objective in objectives)
        {
            DynamicParameters parameters = new();
            parameters.Add("@userid", userId);
            parameters.Add("@themeid", themeId);
            parameters.Add("@id", objective.Id);
            parameters.Add("@description", objective.Description);
            parameters.Add("@colorid", objective.ColorId);
            var sql =
                @"
                    insert into theme_objectives (id, userid, themeid, description, colorid)
                    values(@id, @userid, @themeid, @description, @colorid);
                ";

            tasks.Add(_sql.SaveData(sql, parameters));
        }

        await Task.WhenAll(tasks);
    }

    public async Task<List<ObjectiveModel>> GetObjectiveByThemeId(Guid userId, Guid themeId)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@themeid", themeId);

        var sql =
            @"
                select id, description, colorid
                from theme_objectives
                where userid = @userid and themeid = @themeid
            ";

        return await _sql.LoadData<ObjectiveModel, dynamic>(sql, parameters);
    }

    //YYY
    public async Task UpdateObjective(Guid userId, Guid id, int colorId)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@colorid", colorId);

        var sql =
            @"
                update theme_objectives
                set colorid = @colorid
                where id = @id and userid = @userid
            ";

        await _sql.SaveData(sql, parameters);
    }

    // NNY
    public async Task DeleteObjective(Guid userId, Guid themeId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@themeid", themeId);

        var sql =
            @"
                delete from theme_objectives
                where id = @id and userid = @userid and themeid = @themeid
            ";

        await _sql.SaveData(sql, parameters);
    }
}
