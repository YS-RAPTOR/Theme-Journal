using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class GratitudeData : IGratitudeData
{
    private readonly IDataAccess _sql;

    public GratitudeData(IDataAccess sql)
    {
        _sql = sql;
    }

    public async Task UpsertGratitude(Guid userId, Guid id, GratitudeModel gratitude)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);
        parameters.Add("@description", gratitude.Description);
        parameters.Add("@sentiment", gratitude.Sentiment);
        parameters.Add("@createdat", gratitude.CreatedAt);
        parameters.Add("@time", gratitude.Time.ToString());

        var sql =
            @"
                insert into daily_gratitudes (id, userid, description, sentiment, createdat, time)
                values (@id, @userid, @description, @sentiment, @createdat, @time)
                on duplicate key update description = @description, sentiment = @sentiment;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<GetGratitudeModel>> GetGratitudes(
        Guid userId,
        float? sentiment,
        DateTime? upperDate,
        DateTime? lowerDate,
        TimeOfDay? time
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userId", userId);
        parameters.Add("@sentiment", sentiment);
        parameters.Add("@upperDate", upperDate);
        parameters.Add("@lowerDate", lowerDate);
        parameters.Add("@time", time.HasValue ? time.ToString() : null);

        var sql =
            @"
                select id, createdat, description, sentiment, time
                from daily_gratitudes 
                where userid = @userid and
                (createdat >= @lowerdate or @lowerdate is null) and
                (createdat < @upperdate or @upperdate is null) and
                (sentiment >= @sentiment or @sentiment is null) and
                (time = @time or @time is null);
            ";

        return await _sql.LoadData<GetGratitudeModel, dynamic>(sql, parameters);
    }

    public async Task<List<GratitudeModel>> GetGratitudeById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);

        var sql =
            @"
                select description, sentiment, createdat, time 
                from daily_gratitudes
                where userid = @userid and id = @id;
            ";

        return await _sql.LoadData<GratitudeModel, dynamic>(sql, parameters);
    }
}
