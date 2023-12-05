using Dapper;
using ThemeJournal.ServiceLibrary.DataAccess;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public class TaskData : ITaskData
{
    private readonly IDataAccess _sql;

    public TaskData(IDataAccess sql)
    {
        _sql = sql;
    }

    public void CreateTask(Guid userId, PostTaskModel task)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", task.Id);
        parameters.Add("_Description", task.Description);
        parameters.Add("_PartialDescription", task.PartialDescription);
        parameters.Add("_FullDescription", task.FullDescription);
        parameters.Add("_ObjectiveId", task.ObjectiveId);
        parameters.Add("_StartDate", task.StartDate);
        parameters.Add("_EndDate", task.EndDate);

        _sql.SaveData("Create_Task", parameters);
    }

    public void UpdateTask(Guid userId, Guid id, PutTaskModel task)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_Description", task.Description);
        parameters.Add("_PartialDescription", task.PartialDescription);
        parameters.Add("_FullDescription", task.FullDescription);
        parameters.Add("_ObjectiveId", task.ObjectiveId);
        parameters.Add("_StartDate", task.StartDate);
        parameters.Add("_EndDate", task.EndDate);

        _sql.SaveData("Update_Task", parameters);
    }

    public void ExtendTask(Guid userId, Guid id, DateTime endDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("_Id", id);
        parameters.Add("_UserId", userId);
        parameters.Add("_EndDate", endDate);
        _sql.SaveData("Extend_Task", parameters);
    }

    public List<TaskModel> GetTaskById(Guid userId, Guid id)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_Id", id);
        var output = _sql.LoadData<TaskModel, dynamic>("Get_Task_Id", parameters);
        return output;
    }

    public List<TaskModel> GetTasks(Guid userId, DateTime? upperDate)
    {
        DynamicParameters parameters = new();
        parameters.Add("_UserId", userId);
        parameters.Add("_UpperDate", upperDate);
        var output = _sql.LoadData<TaskModel, dynamic>("Get_Tasks", parameters);
        return output;
    }
}
