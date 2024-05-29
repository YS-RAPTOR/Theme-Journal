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
    public static int BitArray2Int(BitArray bits)
    {
        if (bits.Length != 2){
            return -1;
        }

        if(!bits[0] && !bits[1]){
            return 0;
        }
        else if(bits[0] && !bits[1]){
            return 1;
        }
        else if(bits[0] && bits[1]){
            return 2;
        }
        else{
            return -1;
        }
    }
    public Guid Id { get; set; } = id;
    public DateTime CompletionDate { get; set; } = completionDate;
    public int Progress { get; set; } = BitArray2Int(progress);

}

