using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IThemeData
{
    Task CreateTheme(Guid userId, PostThemeModel theme);
    Task ExtendTheme(Guid userId, Guid id, DateTime endDate);
    Task<List<ThemeModel>> GetThemeByID(Guid userId, Guid id);
    Task<List<GetThemeModel>> GetThemes(Guid userId, DateTime? lowerDate, DateTime? upperDate);
    Task UpdateTheme(Guid userId, Guid id, ThemeModel theme);
}
