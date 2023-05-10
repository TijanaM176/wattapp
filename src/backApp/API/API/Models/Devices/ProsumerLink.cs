using API.Models.Users;

namespace API.Models.Devices
{
    public class ProsumerLink
    {
        public string Id { get; set; }
        public string ProsumerId { get; set; }
        public string ModelId { get; set; }
        public string IpAddress { get; set; }
        public string Name { get; set; }
        public int Activity { get; set; }
        public bool DsoView { get; set; }
        public bool DsoControl { get; set; }
        public virtual Prosumer Prosumer { get; set; }
        public virtual DeviceInfo Device { get; set; }

        public bool Equals(object obj)
        {
            if (obj == null) return false;
            if (!(obj is ProsumerLink other)) return false;

            return ProsumerId == other.ProsumerId;
        }
        public override int GetHashCode()
        {
            return ProsumerId.GetHashCode();
        }
    }
}
