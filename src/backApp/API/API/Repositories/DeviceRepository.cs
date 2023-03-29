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
    public class DeviceRepository //: IDeviceRepository
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
        // svi Prosumeri koji imaju uredjaje

        public async Task<List<ProsumerLink>> getAllProsumersWhoOwnDevice()
        {

            return await _regContext.ProsumerLinks.ToListAsync();
        }
        // zbiran potrosnja energije za korisnike za nedelju dana
        /*public async Task<double> ConsumptionForLastWeekForAllProsumers()
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
        }*/

        // zbiran proizvodnja energije za korisnike za nedelju dana
        /*public async Task<double> ProductionForLastWeekForAllProsumers()
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
        }*/


    }
}
