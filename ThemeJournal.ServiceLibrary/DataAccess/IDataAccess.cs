using Dapper;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public interface IDataAccess
{
    Task SaveData(
        string storedProcedure,
        DynamicParameters data,
        string connectionStringName = "DatabaseConnection"
    );
    List<T> LoadData<T, U>(
        string storedProcedure,
        U parameters,
        string connectionStringName = "DatabaseConnection"
    );
}
