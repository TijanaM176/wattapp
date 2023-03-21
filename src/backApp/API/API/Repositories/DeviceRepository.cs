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

        public async Task<List<Timestamp>> GetTimestamps()
        {
            var dev = await _context.Devices.Find(x => x.Id == "641675fbe539a49febec1c3c").FirstOrDefaultAsync();
            List<Timestamp> ts = dev.Timestamps.FindAll(x => DateTime.Parse(x.Date) > DateTime.Now);
            return ts;
        }

    }
}
