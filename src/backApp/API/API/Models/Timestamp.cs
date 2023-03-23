using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Timestamp
    {
        [BsonElement("date")]
        public DateTime Date { get; set; }

        [BsonElement("active_power")]
        public double ActivePower { get; set; }

        [BsonElement("reactive_power")]
        public double ReactivePower { get; set; }

    }

}
