using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace API.Models.Devices
{
    public class Device
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("ipAddress")]
        public string? IpAddress { get; set; }

        [BsonElement("deviceName")]
        public string? DeviceName { get; set; }
        
        [BsonElement("deviceType")]
        public string? DeviceType { get; set; }
        
        [BsonElement("manufacturer")]
        public string? Manufacturer { get; set; }

        [BsonElement("wattageInKWh")]
        public double Wattage { get; set; }

        [BsonElement("timestamps")]
        public List<Timestamp> Timestamps { get; set; }


    }
}
