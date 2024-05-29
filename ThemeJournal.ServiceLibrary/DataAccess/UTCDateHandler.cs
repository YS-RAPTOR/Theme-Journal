using System.Data;
using Dapper;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public class UTCDateTimeHandler : SqlMapper.TypeHandler<DateTime>
{
    public static void Register(UTCDateTimeHandler handler)
    {
        SqlMapper.RemoveTypeMap(typeof(DateTime));
        SqlMapper.AddTypeHandler(handler);
    }

    public override void SetValue(IDbDataParameter parameter, DateTime value)
    {
        parameter.Value = value;
    }

    public override DateTime Parse(object value)
    {
        return DateTime.SpecifyKind((DateTime)value, DateTimeKind.Utc);
    }
}
