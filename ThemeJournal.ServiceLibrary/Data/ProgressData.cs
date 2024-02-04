using System.Collections;
using System.Data;
using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class ProgressData : IProgressData
{
    private readonly IDataAccess _sql;

    public ProgressData(IDataAccess sql)
    {
        _sql = sql;
    }

    public async Task UpsertProgress(
        Guid userId,
        Guid id,
        PostProgressModel progress,
        BitArray bits
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);
        parameters.Add("@taskid", progress.TaskId);
        parameters.Add("@completiondate", progress.CompletionDate);
        parameters.Add("@progress", bits);

        var sql =
            @"
                insert into daily_progress (id, userid, taskid, completiondate, progress)
                values (@id, @userid, @taskid, @completiondate, @progress)
                on duplicate key update progress = @progress;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task UpdateProgress(Guid userId, Guid id, BitArray progress)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@progress", progress);

        var sql =
            @"
                update daily_progress
                set progress = @progress
                where id = @id and userid = @userid;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<ProgressModel>> GetProgress(
        Guid userId,
        Guid taskId,
        DateTime? upperDate,
        DateTime? lowerDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@taskids", taskId);
        parameters.Add("@lowerdate", lowerDate, DbType.Date);
        parameters.Add("@upperdate", upperDate, DbType.Date);

        var sql =
            @"
                select id, taskid, completiondate, progress
                from daily_progress
                where userid = @userid and
                (@lowerdate is null or completiondate >= @lowerdate) and
                (@upperdate is null or completiondate < @upperdate) and
                taskid = @taskids;
            ";
        return await _sql.LoadData<ProgressModel, dynamic>(sql, parameters);
    }

    public async Task<List<ProgressModel>> GetProgressById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);

        var sql =
            @"
                select id, taskid, completiondate, progress
                from daily_progress
                where userid = @userid and id = @id;
            ";

        return await _sql.LoadData<ProgressModel, dynamic>(sql, parameters);
    }
}
