using MongoDB.Bson.Serialization.Attributes;

namespace API.Models
{
    public class Timestamp
    {
        [BsonElement("date")]
        public string Date { get; set; }

        [BsonElement("time")]
        public string Time { get; set; }

        [BsonElement("active_power")]
        public double ActivePower { get; set; }

        [BsonElement("reactive_power")]
        public double ReactivePower { get; set; }

    }

}
