using API.Models;
using API.Models.Devices;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore.Infrastructure;
using MongoDB.Driver;
using System.Collections;
using System.Linq;
using System;
using System.Collections.Generic;
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
                Type = d.Spec.Type,
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

        public async Task<List<Device>> GetDevicesByCategoryWeekly(string id, string catStr)
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
                Type = d.Spec.Type,
                Manufacturer = d.Spec.Manufacturer,
                Wattage = d.Spec.Wattage,
                Timestamps = d.Usage.Timestamps.Where(t =>
                    t.Date >= DateTime.Now.AddDays(-7) && t.Date <= DateTime.Now
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

        public async Task<double> ConsumptionForLastWeekForProsumer(string id)
        {
            List<Device> devices = await GetDevicesByCategoryWeekly(id, "Consumer");

            double consumption = 0;

            foreach(var device in devices)
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
            var devices = await GetDevicesByCategoryWeekly(id, "Producer");

            double production = 0;

            foreach (var device in devices)
            {
                foreach (var ts in device.Timestamps)
                {
                    if (ts.ActivePower != 0)
                        production += ts.ActivePower;
                }
            }

            return production;
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
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryWeekly(prosumer.ProsumerId, "Consumer"));
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
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryWeekly(prosumer.ProsumerId, "Producer"));
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


    }
}
