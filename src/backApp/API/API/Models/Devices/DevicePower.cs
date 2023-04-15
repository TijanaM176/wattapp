using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using API.Models.Users;

namespace API.Models.Devices
{
    public class DevicePower
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string DeviceId { get; set; }

        [BsonElement("timestamps")]
        public List<Timestamp> Timestamps { get; set; }

    }
}
