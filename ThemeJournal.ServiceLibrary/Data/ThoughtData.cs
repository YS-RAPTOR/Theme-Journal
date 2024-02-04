using System.Data;
using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class ThoughtData : IThoughtData
{
    private readonly IDataAccess _sql;

    public ThoughtData(IDataAccess sql)
    {
        _sql = sql;
    }

    public async Task UpsertThought(Guid userId, Guid id, ThoughtModel thought)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@thought", thought.Thought);
        parameters.Add("@createdat", thought.CreatedAt);

        var sql =
            @"
                insert into daily_thoughts (id, userid, thought, createdat)
                values (@id, @userid, @thought, @createdat)
                on duplicate key update thought=@thought;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<GetThoughtModel>> GetThoughts(
        Guid userId,
        DateTime? upperDate,
        DateTime? lowerDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@lowerdate", lowerDate, DbType.DateTime);
        parameters.Add("@upperdate", upperDate, DbType.DateTime);

        var sql =
            @"    
                select id, createdat, thought
                from daily_thoughts 
                where userid = @userid and 
                (createdat >= @lowerdate or @lowerdate is null) and 
                (createdat < @upperdate or @upperdate is null);
            ";

        return await _sql.LoadData<GetThoughtModel, dynamic>(sql, parameters);
    }

    public async Task<List<ThoughtModel>> GetThoughtById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);

        var sql =
            @$"    
                select thought, createdat
                from daily_thoughts 
                where userid = @userid and id = @id;
            ";

        return await _sql.LoadData<ThoughtModel, dynamic>(sql, parameters);
    }
}
