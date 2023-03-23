using API.Models.Devices;
using MongoDB.Driver;

namespace API.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly DevicesContext _context;
        public DeviceRepository(DevicesContext context)
        {
            _context = context;
        }

        public async Task<string> GetDeviceName(string id)
        {
            var dev = await _context.Consumers.Find(x => x.Id == id).FirstOrDefaultAsync();
            return dev.DeviceName;
        }

    }
}
