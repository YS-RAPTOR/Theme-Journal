namespace ThemeJournal.ServiceLibrary.Models;

public class PostProgressModel
{
    public Guid TaskId { get; set; }
    public DateTime CompletionDate { get; set; }
    public int Progress { get; set; }
}
