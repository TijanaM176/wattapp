namespace API.Models.Devices
{
    public class DeviceCategory
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<DeviceType> Types { get; set; }
        public virtual ICollection<DeviceInfo> Devices { get; set; }
    }
}
