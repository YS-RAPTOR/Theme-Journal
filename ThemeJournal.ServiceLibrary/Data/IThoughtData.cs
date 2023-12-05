using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IThoughtData
{
    List<ThoughtModel> GetThoughtById(Guid userId, Guid id);
    List<GetThoughtModel> GetThoughts(Guid userId, DateTime? upperDate, DateTime? lowerDate);
    void UpsertThought(Guid userId, Guid id, ThoughtModel thought);
}
