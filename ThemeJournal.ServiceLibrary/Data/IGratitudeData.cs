using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IGratitudeData
{
    Task<List<GratitudeModel>> GetGratitudeById(Guid userId, Guid id);
    Task<List<GetGratitudeModel>> GetGratitudes(
        Guid userId,
        float? sentiment,
        DateTime? upperDate,
        DateTime? lowerDate,
        TimeOfDay? time
    );
    Task UpsertGratitude(Guid userId, Guid id, GratitudeModel gratitude);
}
