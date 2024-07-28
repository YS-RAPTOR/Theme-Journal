using System.Data;
using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class UserData : IUserData
{
    private readonly IDataAccess _sql;

    public UserData(IDataAccess sql)
    {
        _sql = sql;
    }

    public async Task UpsertTime(Guid id, TimeModel newTime)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@hours", newTime.Hours);
        parameters.Add("@minutes", newTime.Minutes);

        var sql =
            @"
                insert into users (id, hours, minutes)
                values (@id, @hours, @minutes)
                on conflict (id) do update
                set hours = @hours, minutes = @minutes;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<TimeModel>> GetTime(Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);

        var sql =
            @"    
                select hours, minutes
                from users 
                where id = @id;
            ";

        return await _sql.LoadData<TimeModel, dynamic>(sql, parameters);
    }
}
