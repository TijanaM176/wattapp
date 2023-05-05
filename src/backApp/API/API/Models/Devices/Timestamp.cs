using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Serializers;
using System.Globalization;

namespace API.Models.Devices
{
public class Timestamp
{
    [BsonElement("date")]
    [BsonSerializer(typeof(DateTimeSerializer))]
    public DateTime Date { get; set; }

    [BsonElement("power")]
    public double Power { get; set; }

    [BsonElement("predicted_power")]
    public double PredictedPower { get; set; }
}

public class DateTimeSerializer : IBsonSerializer<DateTime>
{
    public DateTime Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var dateString = context.Reader.ReadString();
        return DateTime.Parse(dateString);
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, DateTime value)
    {
        var dateString = value.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        context.Writer.WriteString(dateString);
    }

    object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        return Deserialize(context, args);
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
    {
        Serialize(context, args, (DateTime)value);
    }

    public Type ValueType => typeof(DateTime);
}
}


