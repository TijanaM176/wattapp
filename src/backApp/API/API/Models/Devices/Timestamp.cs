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

        [BsonElement("power")]
        public double Power { get; set; }

        [BsonElement("predicted_power")]
        public double PredictedPower { get; set; }

        [BsonIgnoreIfDefault]
        public ObjectId _id { get; set; }
    }

}
