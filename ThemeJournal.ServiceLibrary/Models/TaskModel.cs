using System.Collections;

namespace ThemeJournal.ServiceLibrary.Models;

public class TaskModel
{
    public Guid Id { get; set; }
    public string? ObjectiveDescription { get; set; }
    public int? ObjectiveColor { get; set; }
    public string Description { get; set; } = string.Empty;
    public string PartialCompletion { get; set; } = string.Empty;
    public string FullCompletion { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<TaskProgress>? Progress { get; set; }
}

public class TaskProgress(Guid id, DateTime completionDate, BitArray progress)
{
    public Guid Id { get; set; } = id;
    public DateTime CompletionDate { get; set; } = completionDate;
    public BitArray Progress { get; set; } = progress;
}
