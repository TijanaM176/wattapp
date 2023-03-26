﻿using API.Models.Devices;
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
            });
            return devicesWithCurrentConsumption.ToList();
        }

        public async Task<List<Device>> GetAllProducersForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Producers.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var devicesWithCurrentProduction = devices.Select(d => new Device
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
            });
            return devicesWithCurrentProduction.ToList();
        }
        public async Task<List<Device>> GetAllStorageForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Storage.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var devicesWithCurrentStorage = devices.Select(d => new Device
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
            });
            return devicesWithCurrentStorage.ToList();
        }

        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            List<Device> devices = await GetAllConsumersForProsumer(id);
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
            List<Device> devices = await GetAllProducersForProsumer(id);
            double currentProduction = 0;
            foreach (var device in devices)
            {
                currentProduction += device.Timestamps[0].ActivePower;
            }

            return currentProduction;
        }

        public async Task<double> ConsumptionForLastWeekForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Consumers.Find(x => links.Contains(x.DeviceId)).ToListAsync();
            
            var dev = devices.Select(d => new Device
            {
                Timestamps = d.Timestamps.Where(t =>
                    t.Date >= DateTime.Now.AddDays(-7) && t.Date <= DateTime.Now
                ).ToList(),
            });

            double consumption = 0;

            foreach(var device in dev)
            {
                foreach (var ts in device.Timestamps)
                { 
                    if (ts.ActivePower != 0)
                    { 
                        consumption += ts.ActivePower;
                        consumption += ts.ReactivePower;
                    }
                }
            }

            return consumption;
        }

        public async Task<double> ProductionForLastWeekForProsumer(string id)
        {
            var links = await GetLinksForProsumer(id);
            var devices = await _context.Producers.Find(x => links.Contains(x.DeviceId)).ToListAsync();

            var dev = devices.Select(d => new Device
            {
                Timestamps = d.Timestamps.Where(t =>
                    t.Date >= DateTime.Now.AddDays(-7) && t.Date <= DateTime.Now
                ).ToList(),
            });

            double production = 0;

            foreach (var device in dev)
            {
                foreach (var ts in device.Timestamps)
                {
                    if (ts.ActivePower != 0)
                        production += ts.ActivePower;
                }
            }

            return production;
        }
    }
}