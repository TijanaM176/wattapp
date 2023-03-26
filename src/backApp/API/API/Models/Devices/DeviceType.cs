namespace API.Models.Devices
{
    public class DeviceType
    {
        public long Id { get; set; }
        public long CategoryId { get; set; }
        public string Name { get; set; }
        public virtual DeviceCategory Category { get; set; }
        public virtual ICollection<DeviceInfo> Devices { get; set; }
    }
}
