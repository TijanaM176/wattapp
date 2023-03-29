using API.Models.Devices;
using API.Models.Users;

namespace API.Models
{
    public class ProsumerLink
    {
        public string ProsumerId { get; set; }
        public string DeviceId { get; set; }
        public virtual Prosumer Prosumer { get; set; }

        public bool Equals(object obj)
        {
            if(obj == null) return false;
            if(!(obj is ProsumerLink other)) return false;

            return this.ProsumerId == other.ProsumerId;
        }
        public override int GetHashCode()
        {
            return this.ProsumerId.GetHashCode();
        }
    }
}
