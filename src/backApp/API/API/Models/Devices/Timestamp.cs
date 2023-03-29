using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace API.Models.Devices
{
    public class Timestamp
    {
        [BsonElement("date")]
        private string _dateString;

        [BsonIgnore]
        public DateTime Date
        {
            get { return DateTime.Parse(_dateString); }
            set { _dateString = value.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"); }
        }

        [BsonElement("active_power")]
        public double ActivePower { get; set; }

        [BsonElement("reactive_power")]
        public double ReactivePower { get; set; }

        [BsonIgnoreIfDefault]
        public ObjectId _id { get; set; }
    }

}
