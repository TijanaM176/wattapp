using API.Models.Devices;
using MongoDB.Driver;

namespace API.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly DevicesContext _context;
        private readonly RegContext _links;
        public DeviceRepository(DevicesContext context, RegContext links)
        {
            _context = context;
            _links = links;
        }

        public async Task<string> GetDeviceName(string id)
        {
            var dev = await _context.Consumers.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            return dev.DeviceName;
        }

        public async Task<List<string>> GetLinksForProsumer(string id)
        {
            return await _links.ProsumerLinks.Where(x => x.ProsumerId == id).Select(x => x.DeviceId).ToListAsync();
        }

        public async Task<List<Device>> GetAllConsumersForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Consumers.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var devicesWithCurrentConsumption = devices.Select(d => new Device
            {
                DeviceId = d.DeviceId,
                IpAddress = d.IpAddress,
                DeviceName = d.DeviceName,
                DeviceType = d.DeviceType,
                Manufacturer = d.Manufacturer,
                Wattage = d.Wattage,
                Timestamps = d.Timestamps.Where(t =>
                    t.Date.Year == DateTime.Now.Year &&
                    t.Date.Month == DateTime.Now.Month &&
                    t.Date.Day == DateTime.Now.Day &&
                    t.Date.Hour == DateTime.Now.Hour
                ).ToList(),
                Links = d.Links
            });
            return devicesWithCurrentConsumption.ToList();
        }

        public async Task<List<Device>> GetAllProducersForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Producers.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var devicesWithCurrentConsumption = devices.Select(d => new Device
            {
                DeviceId = d.DeviceId,
                IpAddress = d.IpAddress,
                DeviceName = d.DeviceName,
                DeviceType = d.DeviceType,
                Manufacturer = d.Manufacturer,
                Wattage = d.Wattage,
                Timestamps = d.Timestamps.Where(t =>
                    t.Date.Year == DateTime.Now.Year &&
                    t.Date.Month == DateTime.Now.Month &&
                    t.Date.Day == DateTime.Now.Day &&
                    t.Date.Hour == DateTime.Now.Hour
                ).ToList(),
                Links = d.Links
            });
            return devicesWithCurrentConsumption.ToList();
        }
        public async Task<List<Device>> GetAllStorageForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Storage.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var devicesWithCurrentConsumption = devices.Select(d => new Device
            {
                DeviceId = d.DeviceId,
                IpAddress = d.IpAddress,
                DeviceName = d.DeviceName,
                DeviceType = d.DeviceType,
                Manufacturer = d.Manufacturer,
                Wattage = d.Wattage,
                Timestamps = d.Timestamps.Where(t =>
                    t.Date.Year == DateTime.Now.Year &&
                    t.Date.Month == DateTime.Now.Month &&
                    t.Date.Day == DateTime.Now.Day &&
                    t.Date.Hour == DateTime.Now.Hour
                ).ToList(),
                Links = d.Links
            });
            return devicesWithCurrentConsumption.ToList();
        }

    }
}
