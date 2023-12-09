using System.Data;
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

    public async Task CreateTheme(Guid userId, PostThemeModel theme)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userId", userId);
        parameters.Add("@id", theme.Id);
        parameters.Add("@title", theme.Title);
        parameters.Add("@startDate", theme.StartDate);
        parameters.Add("@endDate", theme.EndDate);

        var sql =
            @"
                insert into themes (id, userid, title, startdate, enddate)
                values (@id, @userid, @title, @startdate, @enddate)
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task UpdateTheme(Guid userId, Guid id, ThemeModel theme)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@title", theme.Title);
        parameters.Add("@startdate", theme.StartDate);
        parameters.Add("@enddate", theme.EndDate);

        var sql =
            @"
                update themes
                set title = @title, startdate = @startdate, enddate = @enddate
                where id = @id and userid = @userid;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task ExtendTheme(Guid userId, Guid id, DateTime endDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("@id", id);
        parameters.Add("@userid", userId);
        parameters.Add("@enddate", endDate);

        var sql =
            @"
                update themes
                set enddate = @enddate
                where id = @id and userid = @userid;
            ";

        await _sql.SaveData(sql, parameters);
    }

    public async Task<List<ThemeModel>> GetThemeByID(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@id", id);

        var sql =
            @"
                select title, startdate, enddate
                from themes
                where userid = @userid and id = @id;
            ";

        return await _sql.LoadData<ThemeModel, dynamic>(sql, parameters);
    }

    public async Task<List<GetThemeModel>> GetThemes(
        Guid userId,
        DateTime? lowerDate,
        DateTime? upperDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("@userid", userId);
        parameters.Add("@lowerdate", lowerDate, DbType.DateTime);
        parameters.Add("@upperdate", upperDate, DbType.DateTime);

        var sql =
            @"
            select id, title, startdate, enddate
            from themes
            where userid = @userid and 
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
            ))
            ";

        return await _sql.LoadData<GetThemeModel, dynamic>(sql, parameters);
    }
}
