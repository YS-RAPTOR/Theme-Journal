using System.Collections;
using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class ProgressData : IProgressData
{
    private readonly IDataAccess _sql;

    public ProgressData(IDataAccess sql)
    {
        _sql = sql;
    }

    public void CreateProgress(Guid userId, Guid taskId, List<PostProgressModel> progresses)
    {
        List<Guid> ids = new(progresses.Count);
        List<DateTime> dates = new(progresses.Count);

        foreach (var progress in progresses)
        {
            ids.Add(progress.Id);
            dates.Add(progress.CompletionDate);
        }

        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_TaskId", taskId);
        parameters.Add("_Id", ids);
        parameters.Add("_CompletionDate ", dates);

        _sql.SaveData("Create_Progress", parameters);
    }

    public void UpdateProgress(Guid userId, Guid id, BitArray progress)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_Progress", progress);

        _sql.SaveData("Update_Progress", parameters);
    }

    public List<ProgressModel> GetProgress(
        Guid userId,
        List<Guid> taskIds,
        DateTime? lowerDate,
        DateTime? upperDate
    )
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_TaskIds", taskIds);
        parameters.Add("_LowerDate", lowerDate);
        parameters.Add("_UpperDate", upperDate);

        var output = _sql.LoadData<ProgressModel, dynamic>("Get_Progress", parameters);
        return output;
    }
}
