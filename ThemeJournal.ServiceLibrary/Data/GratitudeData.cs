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

    public void UpsertGratitude(Guid userId, Guid id, GratitudeModel gratitude)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", id);
        parameters.Add("_Description", gratitude.Description);
        parameters.Add("_sentiment", gratitude.Sentiment);
        parameters.Add("_CreatedAt", gratitude.CreatedAt);

        _sql.SaveData("Upsert_Gratitude", parameters);
    }

    public List<GetGratitudeModel> GetGratitudes(
        Guid userId,
        float? sentiment,
        DateTime? upperDate,
        DateTime? lowerDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Sentiment", sentiment);
        parameters.Add("_UpperDate", upperDate);
        parameters.Add("_LowerDate", lowerDate);
        var output = _sql.LoadData<GetGratitudeModel, dynamic>("Get_Gratitude", parameters);
        return output;
    }

    public List<GratitudeModel> GetGratitudeById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", id);
        var output = _sql.LoadData<GratitudeModel, dynamic>("Get_Gratitude_Id", parameters);
        return output;
    }
}
