using API.Models.Devices;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore.Infrastructure;
using MongoDB.Driver;
using System.Collections;
using System.Linq;
using System;
using System.Collections.Generic;
using API.Models.Users;

namespace API.Repositories.DeviceRepository
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
                    t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now || t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now
                ).ToList(),
            });
            return devicesData.ToList();
        }

        public async Task<long> GetDeviceCategory(string name)
        {
            return (await _regContext.DeviceCategories.FirstOrDefaultAsync(x => x.Name == name)).Id;
        }

        public async Task<DeviceCategory> GetDeviceCat(long id)
        {
            return (await _regContext.DeviceCategories.FirstOrDefaultAsync(x => x.Id == id));
        }

        public async Task<DeviceType> GetDeviceType(long id)
        {
            return (await _regContext.DeviceTypes.FirstOrDefaultAsync(x => x.Id == id));
        }

        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            List<Device> devices = await GetDevicesByCategory(id, "Consumer");
            double currentConsumption = 0;
            foreach (var device in devices)
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

        // svi Prosumeri koji imaju uredjaje

        public async Task<List<ProsumerLink>> getAllProsumersWhoOwnDevice()
        {

            return await _regContext.ProsumerLinks.ToListAsync();
        }
        // zbiran potrosnja energije za korisnike za nedelju dana
        public async Task<double> ConsumptionForLastWeekForAllProsumers()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();                                       //svi Prosumer-i sa uredjajem

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double consumptionProsumersForWeek = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForAPeriod(prosumer.ProsumerId, "Consumer", -7));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) // listDevicesbyAllProsumers - lista svih Uredjaja za Sve Prosumere
            {
                foreach (var device in Prosumerdevices) // Prosumerdevices - Lista uredjaja jednog Prosumera
                {
                    foreach (var ts in device.Timestamps) // Potrosnja za konkretan uredjaj
                    {
                        if (ts.ActivePower != 0)
                            consumptionProsumersForWeek += ts.ActivePower;
                        consumptionProsumersForWeek += ts.ReactivePower;
                    }
                }
            }

            return consumptionProsumersForWeek;
        }

        // zbiran proizvodnja energije za korisnike za nedelju dana
        public async Task<double> ProductionForLastWeekForAllProsumers()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();                          //svi Prosumer-i sa uredjajem

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double productionProsumersForWeek = 0.0;

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForAPeriod(prosumer.ProsumerId, "Producer", -7));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) // listDevicesbyAllProsumers - lista svih Uredjaja za Sve Prosumere
            {
                foreach (var device in Prosumerdevices) // Prosumerdevices - Lista uredjaja jednog Prosumera
                {
                    foreach (var ts in device.Timestamps) // Proizvodnja za konkretan uredjaj
                    {
                        if (ts.ActivePower != 0)
                            productionProsumersForWeek += ts.ActivePower;
                    }
                }
            }

            return productionProsumersForWeek;
        }

        public async Task<double> ProsumerDeviceCount(string id)
        {
            var links = await GetLinksForProsumer(id);
            int count = links.Count();

            return count;
        }

        public async Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            var prosumers = await _regContext.Prosumers.ToListAsync();
            List<Prosumer> filteredProsumers = new List<Prosumer>();
            foreach (var prosumer in prosumers)
            {
                var consumption = await CurrentConsumptionForProsumer(prosumer.Id);
                var production = await CurrentProductionForProsumer(prosumer.Id);
                var deviceCount = await ProsumerDeviceCount(prosumer.Id);

                if (consumption >= minConsumption && consumption <= maxConsumption && production >= minProduction && production <= maxProduction && deviceCount >= minDeviceCount && deviceCount <= maxDeviceCount)
                {
                    filteredProsumers.Add(prosumer);
                }    
            }

            return filteredProsumers;
            
        }
        public async Task<DeviceInfo> GetDeviceInfoById(string id)
        {
           DeviceInfo device = await _regContext.Devices.FirstOrDefaultAsync(x => x.Id == id);

            return device;
        }

        public async Task<Dictionary<string, object>> GetDevice(string id)
        {
            var info = await _regContext.Devices.FirstOrDefaultAsync(x => x.Id == id);
            var usage = await _usageContext.PowerUsage.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            Timestamp ts = usage.Timestamps.Where(x => x.Date.Year ==  DateTime.Now.Year && x.Date.Month == DateTime.Now.Month && x.Date.Day == DateTime.Now.Day && x.Date.Hour == DateTime.Now.Hour).FirstOrDefault();
            double currentUsage = Math.Round(ts.ActivePower, 4);
            double max = await MaxUsage(id);
            return new Dictionary<string, object>
            {
                { "Id", id },
                { "IpAddress", info.IpAddress },
                { "Name", info.Name },
                { "CategoryId", info.CategoryId },
                { "TypeId", info.TypeId },
                { "Manufacturer", info.Manufacturer },
                { "Wattage", info.Wattage },
                { "CurrentUsage", currentUsage},
                { "CategoryName", (await GetDeviceCat(info.CategoryId)).Name },
                { "TypeName", (await GetDeviceCat(info.TypeId)).Name },
                { "MaxUsage", max},
                { "AvgUsage", await AvgUsage(id) }
            };
        }

        public async Task<double> MaxUsage(string id)
        {
            DevicePower dev = await _usageContext.PowerUsage.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            return Math.Round(dev.Timestamps.AsQueryable().Max(x => x.ActivePower), 4);
        }

        public async Task<double> AvgUsage(string id)
        {
            DevicePower dev = await _usageContext.PowerUsage.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            return Math.Round(dev.Timestamps.Average(x => x.ActivePower), 4);
        }
    }
}
