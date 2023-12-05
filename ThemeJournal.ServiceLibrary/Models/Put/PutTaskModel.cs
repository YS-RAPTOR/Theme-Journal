namespace ThemeJournal.ServiceLibrary.Models;

public class PutTaskModel
{
    public Guid? ObjectiveId { get; set; }
    public string? Description { get; set; }
    public string? PartialDescription { get; set; }
    public string? FullDescription { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
