using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.ServiceLibrary.Data;

public interface IThemeData
{
    void CreateTheme(Guid userId, PostThemeModel theme);
    void ExtendTheme(Guid userId, Guid id, DateTime endDate);
    List<ThemeModel> GetThemeByID(Guid userId, Guid themeId);
    List<GetThemeModel> GetThemes(Guid userId);
    void UpdateTheme(Guid userId, Guid id, ThemeModel theme);
}
