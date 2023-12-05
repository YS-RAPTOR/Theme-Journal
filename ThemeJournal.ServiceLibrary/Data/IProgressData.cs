using System.Collections;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IProgressData
{
    void CreateProgress(Guid userId, Guid taskId, List<PostProgressModel> progresses);
    List<ProgressModel> GetProgress(
        Guid userId,
        List<Guid> taskIds,
        DateTime? lowerDate,
        DateTime? upperDate
    );
    void UpdateProgress(Guid userId, Guid id, BitArray progress);
}
