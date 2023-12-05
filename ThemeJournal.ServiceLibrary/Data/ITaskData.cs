using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface ITaskData
{
    void CreateTask(Guid userId, PostTaskModel task);
    void ExtendTask(Guid userId, Guid id, DateTime endDate);
    List<TaskModel> GetTasks(Guid userId, DateTime? upperDate);
    List<TaskModel> GetTaskById(Guid userId, Guid id);
    void UpdateTask(Guid userId, Guid id, PutTaskModel task);
}
