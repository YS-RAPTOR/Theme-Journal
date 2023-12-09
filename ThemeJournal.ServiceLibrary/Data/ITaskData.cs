using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface ITaskData
{
    Task CreateTask(Guid userId, PostTaskModel task);
    Task ExtendTask(Guid userId, Guid id, DateTime endDate);
    Task<List<TaskModel>> GetTasks(Guid userId, DateTime? upperDate, DateTime? lowerDate);
    Task<List<TaskModel>> GetTaskById(Guid userId, Guid id);
    Task UpdateTask(Guid userId, Guid id, PutTaskModel task);
}
