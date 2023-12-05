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

    public void UpsertThought(Guid userId, Guid id, ThoughtModel thought)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", id);
        parameters.Add("_Description", thought.Thought);
        parameters.Add("_CreatedAt", thought.CreatedAt);

        _sql.SaveData("Upsert_Thought", parameters);
    }

    public List<GetThoughtModel> GetThoughts(Guid userId, DateTime? upperDate, DateTime? lowerDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_UpperDate", upperDate);
        parameters.Add("_LowerDate", lowerDate);
        var output = _sql.LoadData<GetThoughtModel, dynamic>("Get_Thought", parameters);
        return output;
    }

    public List<ThoughtModel> GetThoughtById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", id);
        var output = _sql.LoadData<ThoughtModel, dynamic>("Get_THought_Id", parameters);
        return output;
    }
}
