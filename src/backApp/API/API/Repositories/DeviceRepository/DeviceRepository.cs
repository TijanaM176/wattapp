using API.Models.Devices;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore.Infrastructure;
using MongoDB.Driver;
using System.Collections;
using System.Linq;
using System;
using System.Collections.Generic;
using API.Models.Users;
using Org.BouncyCastle.Crypto.Digests;
using Microsoft.AspNetCore.Http.Connections;
using System.Diagnostics.Eventing.Reader;
using Org.BouncyCastle.Utilities;
using Amazon.Runtime.Internal;
using System.Xml.Linq;
using API.Models.HelpModels;
using Microsoft.EntityFrameworkCore;
using API.Models;

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

        public async Task<List<ProsumerLink>> GetLinksForProsumer(string id)
        {
            return await _regContext.ProsumerLinks.Where(x => x.ProsumerId == id).ToListAsync();
        }

        public async Task<List<Device>> GetDevicesByCategory(string id, string catStr)
        {
            var linkInfo = await GetLinksForProsumer(id);
            var links = linkInfo.Select(x => x.ModelId);
            var cat = await GetDeviceCategory(catStr);
            var usages = await _usageContext.PowerUsage.Find(x => links.Contains(x.DeviceId)).ToListAsync();
            var specs = await _regContext.Devices.Where(x => x.CategoryId == cat && links.Contains(x.Id)).ToListAsync();
            var devices = from usage in usages
                          join spec in specs on usage.DeviceId equals spec.Id
                          join link in linkInfo on spec.Id equals link.ModelId
                          select new { Usage = usage, Spec = spec, Link = link };

            var devicesData = devices.Select(d => new Device
            {
                Id = d.Link.Id,
                IpAddress = d.Link.IpAddress,
                Name = d.Link.Name,
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
                Predictions = d.Usage.Predictions.Where(t =>
                    t.Date.Year == DateTime.Now.Year &&
                    t.Date.Month == DateTime.Now.Month &&
                    t.Date.Day == DateTime.Now.Day &&
                    t.Date.Hour == DateTime.Now.Hour
                ).ToList()
            });
            return devicesData.ToList();
        }

        public async Task<List<Device>> GetDevicesByCategoryForAPeriod(string id, string catStr, int period)
        {
            var linkInfo = await GetLinksForProsumer(id);
            var links = linkInfo.Select(x => x.ModelId);
            var cat = await GetDeviceCategory(catStr);
            var usages = await _usageContext.PowerUsage.Find(x => links.Contains(x.DeviceId)).ToListAsync();
            var specs = await _regContext.Devices.Where(x => x.CategoryId == cat && links.Contains(x.Id)).ToListAsync();
            var devices = from usage in usages
                          join spec in specs on usage.DeviceId equals spec.Id
                          join link in linkInfo on spec.Id equals link.ModelId
                          select new { Usage = usage, Spec = spec, Link = link };

            var devicesData = devices.Select(d => new Device
            {
                Id = d.Link.Id,
                IpAddress = d.Link.IpAddress,
                Name = d.Link.Name,
                TypeId = d.Spec.TypeId,
                CategoryId = d.Spec.CategoryId,
                Manufacturer = d.Spec.Manufacturer,
                Wattage = d.Spec.Wattage,
                Timestamps = d.Usage.Timestamps.Where(t =>
                    t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now || t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now
                ).ToList(),
                Predictions = d.Usage.Predictions.Where(t =>
                    t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now || t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now
                ).ToList()
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

        //ova bi trebalo da se izbaci
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
        //postoje 2 funkcije za device
        public async Task<DeviceInfo> GetDeviceInfoById(string id)
        {
            DeviceInfo device = null;
            device = await _regContext.Devices.FirstOrDefaultAsync(x => x.Id == id);

            return device;
        }
        public async Task<Device> GetDeviceByCategoryForAPeriod(DeviceInfo deviceinfo, int period)
        {
          
            var usage = await _usageContext.PowerUsage.Find(x => deviceinfo.Id.Equals(x.DeviceId)).FirstAsync();

            var device = new Device();
            device.Id = deviceinfo.Id;
            //device.IpAddress = deviceinfo.IpAddress;
            device.Name = deviceinfo.Name;
            device.TypeId = deviceinfo.TypeId;
            device.CategoryId = deviceinfo.CategoryId;
            device.Manufacturer = deviceinfo.Manufacturer;
            device.Wattage = deviceinfo.Wattage;
            device.Timestamps = usage.Timestamps.Where(t =>
                    t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now || t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now
                ).ToList();
            
          
            return device;
        }
       
        public async Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string id)
        {
            var idDevice = (await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == id)).ModelId;
            DeviceInfo deviceinfo = await GetDeviceInfoById(idDevice);
            EnumCategory.DeviceCatergory deviceCategory;
            if (deviceinfo.CategoryId == 1)
                deviceCategory = EnumCategory.DeviceCatergory.Consumer;
            else if(deviceinfo.CategoryId == 2)
                deviceCategory = EnumCategory.DeviceCatergory.Producer;
            else
                deviceCategory = EnumCategory.DeviceCatergory.Storage;

            return deviceCategory;
        }
        public async Task<Dictionary<DateTime, double>> ProductionConsumptionForLastWeekForDevice(string idDevice)
        {
            var id = (await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == idDevice)).ModelId;
            DeviceInfo deviceInfo = await GetDeviceInfoById(id);
            //if (deviceInfo == null); // greska
            Device device = await GetDeviceByCategoryForAPeriod(deviceInfo, -7);
            Dictionary<DateTime, double> datePowerByDevice = new Dictionary<DateTime, double>();

            if (deviceInfo.CategoryId == 1) // producer device
            {
                foreach (var timestamp in device.Timestamps)
                {
                    if (datePowerByDevice.ContainsKey(timestamp.Date))
                        datePowerByDevice[timestamp.Date] += timestamp.ActivePower;
                    else
                        datePowerByDevice.Add(timestamp.Date, timestamp.ActivePower);
                }
            }
            else if (deviceInfo.CategoryId == 2) // consumer device
            {
                foreach (var timestamp in device.Timestamps)
                {
                    if (datePowerByDevice.ContainsKey(timestamp.Date))
                        datePowerByDevice[timestamp.Date] += timestamp.ActivePower + timestamp.ReactivePower;
                    else
                        datePowerByDevice.Add(timestamp.Date, timestamp.ActivePower + timestamp.ReactivePower);
                }


            }
            else throw new ArgumentException("Devices is Storage!"); ; // storage device, greska

            return datePowerByDevice;
         }


        public async Task<Dictionary<string, object>> GetDevice(string id)
        {
            var link = await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == id);
            var info = await _regContext.Devices.FirstOrDefaultAsync(x => x.Id == link.ModelId);
            var usage = await _usageContext.PowerUsage.Find(x => x.DeviceId == link.ModelId).FirstOrDefaultAsync();
            Timestamp ts = usage.Timestamps.Where(x => x.Date.Year ==  DateTime.Now.Year && x.Date.Month == DateTime.Now.Month && x.Date.Day == DateTime.Now.Day && x.Date.Hour == DateTime.Now.Hour).FirstOrDefault();
            double currentUsage = Math.Round(ts.ActivePower, 4);
            double max = await MaxUsage(link.ModelId);
            return new Dictionary<string, object>
            {
                { "Id", id },
                { "IpAddress", link.IpAddress },
                { "Name", link.Name },
                { "CategoryId", info.CategoryId },
                { "TypeId", info.TypeId },
                { "Manufacturer", info.Manufacturer },
                { "Wattage", info.Wattage },
                { "CurrentUsage", currentUsage},
                { "CategoryName", (await GetDeviceCat(info.CategoryId)).Name },
                { "TypeName", (await GetDeviceType(info.TypeId)).Name },
                { "MaxUsage", max},
                { "AvgUsage", await AvgUsage(link.ModelId) }
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

        public async Task<Prosumer> GetProsumer (string id)
        {
            return await _regContext.Prosumers.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Prosumer>> GetProsumers()
        {
            return await _regContext.Prosumers.ToListAsync();
        
        }
        public async Task EditDevice(string IdDevice, string model, string DeviceName, string IpAddress)
        {
            var device = await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == IdDevice);
            if (device != null)
            { 
                if (model != null && model.Length > 0) device.ModelId = model;
                if (DeviceName != null && DeviceName.Length > 0) device.Name = DeviceName;
                if (IpAddress != null && IpAddress.Length > 0) device.IpAddress = IpAddress;
            }
            await _regContext.SaveChangesAsync();
        }
        private async Task<ProsumerLink> GetProsumerLink(string idDevice)
        {
            ProsumerLink deviceLink = null;
            deviceLink = await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == idDevice);


            return deviceLink;
        }
        public async Task<Boolean> DeleteDevice(string idDevice)
        {
            ProsumerLink prosumerLinks = await GetProsumerLink(idDevice);
            if(prosumerLinks != null)
                _regContext.ProsumerLinks.Remove(prosumerLinks);
            
            await _regContext.SaveChangesAsync();
            return true;
        }

        public async Task InsertLink(ProsumerLink link)
        {
            await _regContext.ProsumerLinks.AddAsync(link);
            await _regContext.SaveChangesAsync();

        }  
        
        public async Task<List<DeviceCategory>> GetCategories()
        {
            return await _regContext.DeviceCategories.ToListAsync();
        }

        public async Task<List<DeviceType>> GetTypesByCategory(long categoryId)
        {
            return await _regContext.DeviceTypes.Where(x => x.CategoryId == categoryId).ToListAsync();
        }
        public async Task<List<DeviceInfo>> GetModels(long typeId)
        {
            return await _regContext.Devices.Where(x => x.TypeId == typeId).ToListAsync();
        }
    }
}
