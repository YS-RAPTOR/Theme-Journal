using System.Collections;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IProgressData
{
    Task UpsertProgress(Guid userId, Guid id, PostProgressModel progress, BitArray bits);
    Task<List<ProgressModel>> GetProgress(
        Guid userId,
        List<Guid> taskIds,
        DateTime? upperDate,
        DateTime? lowerDate
    );
    Task<List<ProgressModel>> GetProgressById(Guid userId, Guid id);
}
