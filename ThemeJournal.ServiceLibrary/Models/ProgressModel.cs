using System.Collections;

namespace ThemeJournal.ServiceLibrary.Models;

public class ProgressModel
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public DateTime CompletionDate { get; set; }
    public BitArray Progress { get; set; } = new(2);
}
