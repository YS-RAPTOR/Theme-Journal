using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IThoughtData
{
    Task<List<ThoughtModel>> GetThoughtById(Guid userId, Guid id);
    Task<List<GetThoughtModel>> GetThoughts(Guid userId, DateTime? upperDate, DateTime? lowerDate);
    Task UpsertThought(Guid userId, Guid id, ThoughtModel thought);
}
