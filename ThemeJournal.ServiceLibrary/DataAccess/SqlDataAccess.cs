using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public class SqlDataAccess : IDataAccess
{
    private readonly IConfiguration _config;

    public SqlDataAccess(IConfiguration config)
    {
        _config = config;
    }

    public Task SaveData(
        string storedProcedure,
        DynamicParameters data,
        string connectionStringName = "DatabaseConnection"
    )
    {
        using NpgsqlConnection connection = new(_config.GetConnectionString(connectionStringName));
        return connection.ExecuteAsync(
            storedProcedure,
            data,
            commandType: CommandType.StoredProcedure
        );
    }

    public List<T> LoadData<T, U>(
        string storedProcedure,
        U parameters,
        string connectionStringName = "DatabaseConnection"
    )
    {
        using NpgsqlConnection connection = new(_config.GetConnectionString(connectionStringName));
        return connection
            .Query<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure)
            .ToList();
    }
}
