namespace API.Models.Devices
{
    public class DeviceInfo
    {
        public string Id { get; set; }
        public string? Name { get; set; }
        public long CategoryId { get; set; }
        public long TypeId { get; set; }
        public string? Manufacturer { get; set; }
        public double Wattage { get; set; }
        public virtual DeviceCategory Category { get; set; }
        public virtual DeviceType Type { get; set; }
        public virtual List<ProsumerLink> Links { get; set; }
    }
}
