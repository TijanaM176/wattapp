using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace API.Models.Devices
{
    public class Device
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("deviceName")]
        public string? DeviceName { get; set; }

        [BsonElement("timestamps")]
        public List<Timestamp> Timestamps { get; set; }


    }
}
