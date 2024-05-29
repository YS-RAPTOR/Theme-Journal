namespace ThemeJournal.ServiceLibrary.Models;

public class PostTaskModel
{
    public Guid Id { get; set; }
    public Guid? ObjectiveId { get; set; }
    public string? Description { get; set; }
    public string? PartialCompletion { get; set; }
    public string? FullCompletion { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
