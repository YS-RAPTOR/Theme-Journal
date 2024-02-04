using System.Data;
using Dapper;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public class GUIDHandler : SqlMapper.TypeHandler<Guid>
{
    public static void Register(GUIDHandler handler)
    {
        SqlMapper.RemoveTypeMap(typeof(Guid));
        SqlMapper.AddTypeHandler(handler);
    }

    public override void SetValue(IDbDataParameter parameter, Guid value)
    {
        parameter.Value = value.ToByteArray();
        parameter.DbType = DbType.Binary;
    }

    public override Guid Parse(object value)
    {
        return new Guid((byte[])value);
    }
}
