using MongoDB.Bson.Serialization.Attributes;

namespace API.Models.Devices
{
    public class Device : DeviceInfo
    {
        public string IpAddress { get; set; }
        public List<Timestamp> Timestamps { get; set; }
        public List<Timestamp> Predictions { get; set; }
    }
}
