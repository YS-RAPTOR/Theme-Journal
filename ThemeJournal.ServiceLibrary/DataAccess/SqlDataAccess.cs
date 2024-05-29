using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public class SqlDataAccess : IDataAccess
{
    private readonly IConfiguration _config;

    public SqlDataAccess(IConfiguration config)
    {
        _config = config;
    }

    public async Task SaveData(
        string sql,
        DynamicParameters data,
        string connectionStringName = "DatabaseConnection"
    )
    {
        using (MySqlConnection connection = new(_config.GetConnectionString(connectionStringName)))
        {
            connection.Open();
            await connection.ExecuteAsync(sql, data);
        };
    }

    public async Task<List<T>> LoadData<T, U>(
        string sql,
        U parameters,
        string connectionStringName = "DatabaseConnection"
    )
    {
        using (MySqlConnection connection = new(_config.GetConnectionString(connectionStringName)))
        {
            connection.Open();
            var output = await connection.QueryAsync<T>(sql, parameters);
            return output.ToList();
        };
    }
}
