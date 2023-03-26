using API.Models.Devices;
using API.Models.Users;

namespace API.Models
{
    public class ProsumerLink
    {
        public string ProsumerId { get; set; }
        public string DeviceId { get; set; }
        public virtual Prosumer Prosumer { get; set; }
    }
}
