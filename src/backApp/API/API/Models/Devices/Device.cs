using MongoDB.Bson.Serialization.Attributes;

namespace API.Models.Devices
{
    public class Device : DeviceInfo
    {
        public string? ModelId { get; set; }
        public string IpAddress { get; set; }
        public List<Timestamp> Timestamps { get; set; }
        public int Activity { get; set; }
        public bool DsoView { get; set; }
        public bool DsoControl { get; set; }
    }
}
