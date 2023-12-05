using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IGratitudeData
{
    List<GratitudeModel> GetGratitudeById(Guid userId, Guid id);
    List<GetGratitudeModel> GetGratitudes(
        Guid userId,
        float? sentiment,
        DateTime? upperDate,
        DateTime? lowerDate
    );
    void UpsertGratitude(Guid userId, Guid id, GratitudeModel gratitude);
}
