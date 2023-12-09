using System.Data;
using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class TaskData : ITaskData
{
    private readonly IDataAccess _sql;

    public TaskData(IDataAccess sql)
    {
        _sql = sql;
    }

    public async Task CreateTask(Guid userId, PostTaskModel task)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", task.Id);
        parameters.Add("@description", task.Description);
        parameters.Add("@partialcompletion", task.PartialCompletion);
        parameters.Add("@fullcompletion", task.FullCompletion);
        parameters.Add("@objectiveid", task.ObjectiveId);
        parameters.Add("@startdate", task.StartDate);
        parameters.Add("@enddate", task.EndDate);

        var sql =
            @"
                insert into daily_tasks (id, userid, objectiveid, description, partialcompletion, fullcompletion, startdate, enddate)
                values (@id, @userid, @objectiveid, @description, @partialcompletion, @fullcompletion, @startdate, @enddate);
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task UpdateTask(Guid userId, Guid id, PutTaskModel task)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@description", task.Description);
        parameters.Add("@partialcompletion", task.PartialCompletion);
        parameters.Add("@fullcompletion", task.FullCompletion);
        parameters.Add("@objectiveid", task.ObjectiveId);
        parameters.Add("@startdate", task.StartDate);
        parameters.Add("@enddate", task.EndDate);

        var sql =
            @"
                update daily_tasks
                set objectiveid = @objectiveid, description = @description, partialcompletion = @partialcompletion, fullcompletion = @fullcompletion, startdate = @startdate, enddate = @enddate
                where id = @id and userid = @userid;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task ExtendTask(Guid userId, Guid id, DateTime endDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@enddate", endDate);

        var sql =
            @"
                update daily_tasks
                set enddate = @enddate
                where id = @id and userid = @userid;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<TaskModel>> GetTaskById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);

        var sql =
            @$"
                select 
                daily_tasks.id as {nameof(TaskModel.Id)},
                theme_objectives.description as {nameof(TaskModel.ObjectiveDescription)},
                theme_objectives.colorid as {nameof(TaskModel.ObjectiveColor)},
                daily_tasks.description as {nameof(TaskModel.Description)},
                daily_tasks.partialcompletion as {nameof(TaskModel.PartialCompletion)},
                daily_tasks.fullcompletion as {nameof(TaskModel.FullCompletion)},
                daily_tasks.startdate as {nameof(TaskModel.StartDate)},
                daily_tasks.enddate as {nameof(TaskModel.EndDate)}
                from daily_tasks
                left join theme_objectives on daily_tasks.objectiveid = theme_objectives.id
                where daily_tasks.userid = @userid and daily_tasks.id = @id;
            ";

        return await _sql.LoadData<TaskModel, dynamic>(sql, parameters);
    }

    public async Task<List<TaskModel>> GetTasks(
        Guid userId,
        DateTime? upperDate,
        DateTime? lowerDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@upperdate", upperDate, DbType.DateTime);
        parameters.Add("@lowerdate", lowerDate, DbType.DateTime);

        var sql =
            @$"
                select 
                daily_tasks.id as {nameof(TaskModel.Id)},
                theme_objectives.description as {nameof(TaskModel.ObjectiveDescription)},
                theme_objectives.colorid as {nameof(TaskModel.ObjectiveColor)},
                daily_tasks.description as {nameof(TaskModel.Description)},
                daily_tasks.partialcompletion as {nameof(TaskModel.PartialCompletion)},
                daily_tasks.fullcompletion as {nameof(TaskModel.FullCompletion)},
                daily_tasks.startdate as {nameof(TaskModel.StartDate)},
                daily_tasks.enddate as {nameof(TaskModel.EndDate)}
                from daily_tasks
                left join theme_objectives on daily_tasks.objectiveid = theme_objectives.id
                where daily_tasks.userid = @userid and 
                ((
                (@lowerdate is null) 
                or 
                (startdate <= @lowerdate and @lowerdate < enddate)
                )
                or
                (
                (@upperdate is null) 
                or
                (startdate < @upperdate and @upperdate < enddate)
                ));
            ";

        return await _sql.LoadData<TaskModel, dynamic>(sql, parameters);
    }
}
