using API.Models.Devices;
using MongoDB.Driver;

namespace API.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly DevicesContext _usageContext;
        private readonly RegContext _regContext;
        public DeviceRepository(DevicesContext usage, RegContext reg)
        {
            _usageContext = usage;
            _regContext = reg;
        }

        public async Task<List<string>> GetLinksForProsumer(string id)
        {
            return await _regContext.ProsumerLinks.Where(x => x.ProsumerId == id).Select(x => x.DeviceId).ToListAsync();
        }

        public async Task<List<Device>> GetDevicesByCategory(string id, string catStr)
        {
            var links = await GetLinksForProsumer(id);
            var cat = await GetDeviceCategory(catStr);
            var usages = await _usageContext.PowerUsage.Find(x => links.Contains(x.DeviceId)).ToListAsync();
            var specs = await _regContext.Devices.Where(x => x.CategoryId == cat && links.Contains(x.Id)).ToListAsync();
            var devices = from usage in usages join spec in specs on usage.DeviceId equals spec.Id select new { Usage = usage, Spec = spec };
            int count = devices.Count();

            var devicesData = devices.Select(d => new Device
            {
                Id = d.Spec.Id,
                IpAddress = d.Spec.IpAddress,
                Name = d.Spec.Name,
                TypeId = d.Spec.TypeId,
                CategoryId = d.Spec.CategoryId,
                Manufacturer = d.Spec.Manufacturer,
                Wattage = d.Spec.Wattage,
                Timestamps = d.Usage.Timestamps.Where(t =>
                    t.Date.Year == DateTime.Now.Year &&
                    t.Date.Month == DateTime.Now.Month &&
                    t.Date.Day == DateTime.Now.Day &&
                    t.Date.Hour == DateTime.Now.Hour
                ).ToList(),
            });
            return devicesData.ToList();
        }

        public async Task<List<Device>> GetDevicesByCategoryForAPeriod(string id, string catStr, int period)
        {
            var links = await GetLinksForProsumer(id);
            var cat = await GetDeviceCategory(catStr);
            var usages = await _usageContext.PowerUsage.Find(x => links.Contains(x.DeviceId)).ToListAsync();
            var specs = await _regContext.Devices.Where(x => x.CategoryId == cat && links.Contains(x.Id)).ToListAsync();
            var devices = from usage in usages join spec in specs on usage.DeviceId equals spec.Id select new { Usage = usage, Spec = spec };
            int count = devices.Count();

            var devicesData = devices.Select(d => new Device
            {
                Id = d.Spec.Id,
                IpAddress = d.Spec.IpAddress,
                Name = d.Spec.Name,
                TypeId = d.Spec.TypeId,
                CategoryId = d.Spec.CategoryId,
                Manufacturer = d.Spec.Manufacturer,
                Wattage = d.Spec.Wattage,
                Timestamps = d.Usage.Timestamps.Where(t =>
                    (t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now) || (t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now)
                ).ToList(),
            });
            return devicesData.ToList();
        }

        public async Task<long> GetDeviceCategory(string name)
        {
            return (await _regContext.DeviceCategories.FirstOrDefaultAsync(x => x.Name == name)).Id;
        }

        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            List<Device> devices = await GetDevicesByCategory(id, "Consumer");
            double currentConsumption = 0;
            foreach ( var device in devices)
            {
                currentConsumption += device.Timestamps[0].ActivePower;
                currentConsumption += device.Timestamps[0].ReactivePower;
            }

            return currentConsumption;
        }
        public async Task<double> CurrentProductionForProsumer(string id)
        {
            List<Device> devices = await GetDevicesByCategory(id, "Producer");
            var cat = await GetDeviceCategory("Producer");
            devices = devices.Where(x => x.CategoryId == cat).ToList();
            double currentProduction = 0;
            foreach (var device in devices)
            {
                currentProduction += device.Timestamps[0].ActivePower;
            }

            return currentProduction;
        }

        public async Task<Dictionary<DateTime, double>> ConsumptionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await GetDevicesByCategoryForAPeriod(id, "Consumer", period);
            Dictionary<DateTime, double> datePowerDict = new Dictionary<DateTime, double>();

            foreach (var dev in devices)
            {
                foreach (var timestamp in dev.Timestamps)
                {
                    if (datePowerDict.ContainsKey(timestamp.Date))
                        datePowerDict[timestamp.Date] += timestamp.ActivePower + timestamp.ReactivePower;
                    else
                        datePowerDict.Add(timestamp.Date, timestamp.ActivePower + timestamp.ReactivePower);
                }
            }

            return datePowerDict;
        }

        public async Task<Dictionary<DateTime, double>> ProductionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await GetDevicesByCategoryForAPeriod(id, "Producer", period);
            Dictionary<DateTime, double> datePowerDict = new Dictionary<DateTime, double>();

            foreach (var dev in devices)
            {
                foreach (var timestamp in dev.Timestamps)
                {
                    if (datePowerDict.ContainsKey(timestamp.Date))
                        datePowerDict[timestamp.Date] += timestamp.ActivePower;
                    else
                        datePowerDict.Add(timestamp.Date, timestamp.ActivePower);
                }
            }

            return datePowerDict;
        }
    }
}
