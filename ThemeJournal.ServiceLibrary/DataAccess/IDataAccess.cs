using Dapper;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public interface IDataAccess
{
    Task SaveData(
        string sql,
        DynamicParameters data,
        string connectionStringName = "DatabaseConnection"
    );
    Task<List<T>> LoadData<T, U>(
        string sql,
        U parameters,
        string connectionStringName = "DatabaseConnection"
    );
}
