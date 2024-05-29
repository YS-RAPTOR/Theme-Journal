namespace ThemeJournal.ServiceLibrary.Models;

public class GetThoughtModel
{
    public Guid Id { get; set; }
    public string Thought { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
