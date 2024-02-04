using System.Collections;
using System.Data;
using Dapper;

namespace ThemeJournal.ServiceLibrary.DataAccess;

public class BitHandler : SqlMapper.TypeHandler<BitArray>
{
    public static void Register(BitHandler handler)
    {
        SqlMapper.RemoveTypeMap(typeof(Guid));
        SqlMapper.AddTypeHandler(handler);
    }

    public override void SetValue(IDbDataParameter parameter, BitArray value)
    {
        // convert BitArray to byte array
        string bits = "";
        foreach (bool bit in value)
        {
            bits += bit ? "1" : "0";
        }

        parameter.Value = bits;
        parameter.DbType = DbType.Object;
    }


    public override BitArray Parse(object value)
    {
        // value is an int
        Console.WriteLine(value);
        BitArray bits = new(2);

        switch ((ulong)value)
        {
            case 0:
                bits[0] = false;
                bits[1] = false;
                Console.WriteLine("0");
                break;
            case 2:
                bits[0] = true;
                bits[1] = false;
                Console.WriteLine("2");
                break;
            case 3:
                bits[0] = true;
                bits[1] = true;
                Console.WriteLine("3");
                break;
            default:
                throw new ArgumentOutOfRangeException("Invalid Progress Must be 0,2 or 3");
        }
        return bits;
    }
}
