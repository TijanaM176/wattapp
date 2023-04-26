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
using SharpCompress.Common;

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

        public async Task<List<Device>> GetDevicesByCategory(string id, string catStr, string role)
        {
            List<ProsumerLink> linkInfo;
            if (role == "Prosumer")
                linkInfo = await GetLinksForProsumer(id);
            else
                linkInfo = (await GetLinksForProsumer(id)).Where(x => x.DsoView).ToList();
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
            List<Device> devices = await GetDevicesByCategory(id, "Consumer", "Prosumer");
            double currentConsumption = 0;
            foreach (var device in devices)
            {
                currentConsumption += device.Timestamps[0].Power;
            }

            return currentConsumption;
        }
        public async Task<double> CurrentProductionForProsumer(string id)
        {
            List<Device> devices = await GetDevicesByCategory(id, "Producer", "Prosumer");
            var cat = await GetDeviceCategory("Producer");
            devices = devices.Where(x => x.CategoryId == cat).ToList();
            double currentProduction = 0;
            foreach (var device in devices)
            {
                currentProduction += device.Timestamps[0].Power;
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
                        if (ts.Power != 0)
                            consumptionProsumersForWeek += ts.Power;
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
                        if (ts.Power != 0)
                            productionProsumersForWeek += ts.Power;
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
        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ProductionConsumptionTimestampsForDevice(string idDevice, int period)
        {
            var id = (await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == idDevice)).ModelId;
            DeviceInfo deviceInfo = await GetDeviceInfoById(id);
            //if (deviceInfo == null); // greska
            Device device = await GetDeviceByCategoryForAPeriod(deviceInfo, period);
            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevice = new Dictionary<string, Dictionary<DateTime, double>>();
            datePowerByDevice["timestamps"] = new Dictionary<DateTime, double>();
            datePowerByDevice["predictions"] = new Dictionary<DateTime, double>();

            if (deviceInfo.CategoryId == 1 || deviceInfo.CategoryId == 2) // consumer / producer device
            {
                for (int i = 0; i < device.Timestamps.Count; i++)
                {
                    var timestamp = device.Timestamps[i];
                    if (datePowerByDevice["timestamps"].ContainsKey(timestamp.Date))
                    {
                        datePowerByDevice["timestamps"][timestamp.Date] += timestamp.Power;
                        datePowerByDevice["predictions"][timestamp.Date] += timestamp.PredictedPower;
                    }
                    else
                    {
                        datePowerByDevice["timestamps"].Add(timestamp.Date, timestamp.Power);
                        datePowerByDevice["predictions"].Add(timestamp.Date, timestamp.PredictedPower);
                    }
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
            double currentUsage = Math.Round(ts.Power, 4);
            double max = await MaxUsage(link.ModelId);
            return new Dictionary<string, object>
            {
                { "Id", id },
                { "IpAddress", link.IpAddress },
                { "Name", link.Name },
                { "CategoryId", info.CategoryId },
                { "TypeId", info.TypeId },
                {"ModelId", info.Id },
                {"ModelName", info.Name },
                { "Manufacturer", info.Manufacturer },
                { "Wattage", info.Wattage },
                { "CurrentUsage", currentUsage},
                { "CategoryName", (await GetDeviceCat(info.CategoryId)).Name },
                { "TypeName", (await GetDeviceType(info.TypeId)).Name },
                { "MaxUsage", max},
                { "AvgUsage", await AvgUsage(link.ModelId) },
                { "DsoView", link.DsoView },
                { "DsoControl", link.DsoControl },
                { "Activity", link.Activity }
            };
        }

        public async Task<double> MaxUsage(string id)
        {
            DevicePower dev = await _usageContext.PowerUsage.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            return Math.Round(dev.Timestamps.AsQueryable().Max(x => x.Power), 4);
        }

        public async Task<double> AvgUsage(string id)
        {
            DevicePower dev = await _usageContext.PowerUsage.Find(x => x.DeviceId == id).FirstOrDefaultAsync();
            return Math.Round(dev.Timestamps.Average(x => x.Power), 4);
        }

        public async Task<Prosumer> GetProsumer (string id)
        {
            return await _regContext.Prosumers.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Prosumer>> GetProsumers()
        {
            return await _regContext.Prosumers.ToListAsync();
        
        }
        public async Task EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl)
        {
            var device = await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == IdDevice);
            if (device != null)
            { 
                if (model != null && model.Length > 0) device.ModelId = model;
                if (DeviceName != null && DeviceName.Length > 0) device.Name = DeviceName;
                if (IpAddress != null && IpAddress.Length > 0) device.IpAddress = IpAddress;
                device.DsoView = dsoView;
                device.DsoControl = dsoControl;
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

        public async Task<string> GetCity(long? id)
        {
            return (await _regContext.Cities.FirstOrDefaultAsync(x => x.Id == id)).Name;
        }
        public async Task<List<Device>> GetDevicesByCategoryForAPeriodSTARTOFWEEK(string id, string catStr, int periodInDays)
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

            var startDate = DateTime.Today.AddDays(-periodInDays + 1);
            var endDate = DateTime.Today;

            var devicesData = devices.Select(d => new Device
            {
                Id = d.Link.Id,
                IpAddress = d.Link.IpAddress,
                Name = d.Link.Name,
                TypeId = d.Spec.TypeId,
                CategoryId = d.Spec.CategoryId,
                Manufacturer = d.Spec.Manufacturer,
                Wattage = d.Spec.Wattage,
                Timestamps = d.Usage.Timestamps.Where(t => t.Date >= startDate && t.Date <= endDate).ToList(),
            });
            return devicesData.ToList();
        }


        public static (DateTime start, DateTime end) GetCurrentWeekDates()
        {
           
            DateTime today = DateTime.Now.Date;
            DateTime monday = today.AddDays(-(int)today.DayOfWeek + 1);
            if (DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
            {


                return (monday, today);
            }
            else
            {
                monday -= TimeSpan.FromDays(7);
                return (monday, today);
            }
        }
        public static (DateTime start, DateTime end) GetPastWeekDates()
        {

            DateTime past = DateTime.Now.Date; 
            past -= TimeSpan.FromDays(7);
            
            DateTime monday = past.AddDays(-(int)past.DayOfWeek + 1);
            if (DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
            {


                return (monday, past);
            }
            else
            {
                monday -= TimeSpan.FromDays(7);
                return (monday, past);
            }

           
         
        }
        public static (DateTime start, DateTime end) GetFutureWeekDates()
        {

            DateTime future = DateTime.Now.Date;
            future += TimeSpan.FromDays(7);

            DateTime monday = future.AddDays(-(int)future.DayOfWeek + 1);
            if (DateTime.Now.DayOfWeek != DayOfWeek.Sunday)
            {


                return (monday, future);
            }
            else
            {
                monday -= TimeSpan.FromDays(7);
                return (monday, future);
            }


            
           
        }
        public async Task<List<Device>> GetDevicesByCategoryForThisPastFutureWeek(string id, string catStr, string answer)
        {
            DateTime startDate;
            DateTime endDate;
          
            if (answer.Equals("this"))
                 (startDate, endDate) = GetCurrentWeekDates();
            else if(answer.Equals("past"))
                 (startDate, endDate) = GetPastWeekDates();
            else
                (startDate, endDate) = GetFutureWeekDates();

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
                Timestamps = d.Usage.Timestamps.Where(t => t.Date >= startDate && t.Date <= endDate).ToList(),
            });
            return devicesData.ToList();
        }
        
        public async Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalConsumption()
        {
            DateTime thismonday, thisday;
            (thismonday, thisday) = GetCurrentWeekDates();

            List<DateTime> thisweek = new List<DateTime>();
            thisweek.Add(thismonday);
            thisweek.Add(thisday);

            DateTime pastmonday, pastday;
            (pastmonday, pastday) = GetPastWeekDates();

            List<DateTime> lastweek = new List<DateTime>();
            lastweek.Add(pastmonday);
            lastweek.Add(pastday);

            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();                                    

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double consumptionProsumersForThisWeek = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Consumer", "this"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) // listDevicesbyAllProsumers - lista svih Uredjaja za Sve Prosumere
            {
                foreach (var device in Prosumerdevices) // Prosumerdevices - Lista uredjaja jednog Prosumera
                {
                    foreach (var ts in device.Timestamps) // Potrosnja za konkretan uredjaj
                    {
                        if (ts.Power != 0)
                        consumptionProsumersForThisWeek += ts.Power;
                    }
                }
            }
            double consumptionProsumersForLastWeek = 0.0;


            listDevicesbyAllProsumers.Clear();

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Consumer", "past"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices) 
                {
                    foreach (var ts in device.Timestamps) 
                    {
                        if (ts.Power != 0)
                            consumptionProsumersForLastWeek += ts.Power;
                    }
                }
            }

            if (consumptionProsumersForLastWeek == 0 && consumptionProsumersForThisWeek == 0)
                return (0.0, 0.0, "0", thisweek, lastweek);
            else if (consumptionProsumersForLastWeek == 0)
                return (consumptionProsumersForThisWeek, 0.0, "0", thisweek, lastweek);
            else if (consumptionProsumersForThisWeek == 0)
                return (0, consumptionProsumersForLastWeek, "0", thisweek, lastweek);
            else
            {
               
                double ratio = Math.Abs((consumptionProsumersForThisWeek - consumptionProsumersForLastWeek) / (double)consumptionProsumersForLastWeek) * 100;
                ratio = Math.Round(ratio, 2);
                if(consumptionProsumersForLastWeek > consumptionProsumersForThisWeek)
                    return (consumptionProsumersForThisWeek, consumptionProsumersForLastWeek, (-ratio).ToString() + "%", thisweek, lastweek);
                else
                    return (consumptionProsumersForThisWeek, consumptionProsumersForLastWeek, ratio.ToString() + "%", thisweek, lastweek);
            }
        }
        public async Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalProduction()
        {
            DateTime thismonday, thisday;
             (thismonday, thisday)= GetCurrentWeekDates();

            List<DateTime> thisweek = new List<DateTime>();
            thisweek.Add(thismonday);
            thisweek.Add(thisday);

            DateTime pastmonday, pastday;
            (pastmonday, pastday) = GetPastWeekDates();

            List<DateTime> lastweek = new List<DateTime>();
            lastweek.Add(pastmonday);
            lastweek.Add(pastday);


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double productionProsumersForThisWeek = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Producer", "this"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) 
            {
                foreach (var device in Prosumerdevices) 
                {
                    foreach (var ts in device.Timestamps) 
                    {
                        if (ts.Power != 0)
                            productionProsumersForThisWeek += ts.Power;
                    }
                }
            }
            listDevicesbyAllProsumers.Clear();
            double productionProsumersForLastWeek = 0.0;

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Producer", "past"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices) 
                {
                    foreach (var ts in device.Timestamps) 
                    {
                        if (ts.Power != 0)
                            productionProsumersForLastWeek += ts.Power;
                    }
                }
            }
            if (productionProsumersForLastWeek == 0 && productionProsumersForThisWeek == 0)
                return (0.0, 0.0, "0", thisweek, lastweek);
            else if (productionProsumersForLastWeek == 0)
                return (productionProsumersForThisWeek, 0.0, "0", thisweek, lastweek);
            else if (productionProsumersForThisWeek == 0)
                return (0, productionProsumersForLastWeek, "0", thisweek, lastweek);
            else
            {
                double ratio = Math.Abs((productionProsumersForThisWeek - productionProsumersForLastWeek) / (double)productionProsumersForLastWeek) * 100;
                ratio = Math.Round(ratio, 2);
                if(productionProsumersForLastWeek > productionProsumersForThisWeek)
                    return (productionProsumersForThisWeek, productionProsumersForLastWeek, (-ratio).ToString()+" %", thisweek, lastweek);
                else
                    return (productionProsumersForThisWeek, productionProsumersForLastWeek, (ratio).ToString()+" %", thisweek, lastweek);
            }
       }

        public async Task<double> NextWeekTotalPredictedProduction()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double productionProsumersForNextWeekPrediction = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Producer", "future"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) 
            {
                foreach (var device in Prosumerdevices) 
                {
                    foreach (var ts in device.Timestamps) 
                    {
                        if (ts.PredictedPower != 0)
                            productionProsumersForNextWeekPrediction += ts.PredictedPower;
                    }
                }
            }

            return productionProsumersForNextWeekPrediction;
        }
        public async Task<double> NextWeekTotalPredictedConsumption()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double consumptionProsumersForNextWeekPrediction = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Consumer", "future"));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.PredictedPower != 0)
                            consumptionProsumersForNextWeekPrediction += ts.PredictedPower;
                    }
                }
            }

            return consumptionProsumersForNextWeekPrediction;
        }

        public async Task<Device> GetDeviceByCategoryForAPeriodForDays(DeviceInfo deviceinfo, int period)
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
            device.Timestamps = usage.Timestamps.Where(t => t.Date >= DateTime.Now.AddDays(1).Date && t.Date < DateTime.Now.AddDays(period + 1).Date
                ).ToList();

            return device;
        }
        public async Task<(Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>)> PredictionForDevice(string idDevice)
        {
            

            var id = (await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == idDevice)).ModelId;
            DeviceInfo deviceInfo = await GetDeviceInfoById(id);
            //if (deviceInfo == null); // greska

            Device device1 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 1); // jedan dan
            Device device3 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 3); // za dva dana
            Device device7 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 7); // za sedam dana

            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredicitionFor1Day = new Dictionary<string, Dictionary<DateTime, double>>();
            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredicitionFor3Day = new Dictionary<string, Dictionary<DateTime, double>>();
            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredicitionFor7Day = new Dictionary<string, Dictionary<DateTime, double>>();

            datePowerByDevicePredicitionFor1Day["Predictions For 1 day"] = new Dictionary<DateTime, double>();
            datePowerByDevicePredicitionFor3Day["Predictions For 3 day"] = new Dictionary<DateTime, double>();
            datePowerByDevicePredicitionFor7Day["Predictions For 7 day"] = new Dictionary<DateTime, double>();

            if (deviceInfo.CategoryId == 1 || deviceInfo.CategoryId == 2) // consumer / producer device
            {
                for (int i = 0; i < device1.Timestamps.Count; i++)
                {
                    var timestamp = device1.Timestamps[i];
                    var roundedTime = new DateTime(timestamp.Date.Year, timestamp.Date.Month, timestamp.Date.Day, timestamp.Date.Hour, timestamp.Date.Minute / 2 * 2, 0); // zaokruzi vreme na svaka dva minuta
                    var twoHourTime = new DateTime(roundedTime.Year, roundedTime.Month, roundedTime.Day, roundedTime.Hour - (roundedTime.Hour % 2), 0, 0); // zaokruzi vreme na svaka dva sata

                    if (datePowerByDevicePredicitionFor1Day["Predictions For 1 day"].ContainsKey(twoHourTime))
                    {
                        datePowerByDevicePredicitionFor1Day["Predictions For 1 day"][twoHourTime] += timestamp.PredictedPower;
                    }
                    else
                    {
                        datePowerByDevicePredicitionFor1Day["Predictions For 1 day"].Add(twoHourTime, timestamp.PredictedPower);
                    }
                }

                // Prolazi kroz agregirane vrednosti i saberi vrednosti za svaka dva sata
                var tempDict = new Dictionary<DateTime, double>();
                foreach (var kvp in datePowerByDevicePredicitionFor1Day["Predictions For 1 day"])
                {
                    var twoHourTime = new DateTime(kvp.Key.Year, kvp.Key.Month, kvp.Key.Day, kvp.Key.Hour - (kvp.Key.Hour % 2), 0, 0); // zaokruzi vreme na svaka dva sata
                    if (tempDict.ContainsKey(twoHourTime))
                    {
                        tempDict[twoHourTime] += kvp.Value;
                    }
                    else
                    {
                        tempDict.Add(twoHourTime, kvp.Value);
                    }
                }
                datePowerByDevicePredicitionFor1Day["Predictions For 1 day"] = tempDict;
            }
            else
            {
                throw new ArgumentException("Devices is Storage!");
            }
            if (deviceInfo.CategoryId == 1 || deviceInfo.CategoryId == 2) // consumer / producer device
            {
                for (int i = 0; i < device3.Timestamps.Count; i++)
                {
                    var timestamp = device3.Timestamps[i];
                    var roundedDate = new DateTime(timestamp.Date.Year, timestamp.Date.Month, timestamp.Date.Day);
                    if (datePowerByDevicePredicitionFor3Day["Predictions For 3 day"].ContainsKey(roundedDate))
                    {
                        datePowerByDevicePredicitionFor3Day["Predictions For 3 day"][roundedDate] += timestamp.PredictedPower;
                    }
                    else
                    {
                        datePowerByDevicePredicitionFor3Day["Predictions For 3 day"].Add(roundedDate, timestamp.PredictedPower);
                    }
                }
            }
            else
            {
                throw new ArgumentException("Devices is Storage!");
            }
            if (deviceInfo.CategoryId == 1 || deviceInfo.CategoryId == 2) // consumer / producer device
            {
                for (int i = 0; i < device7.Timestamps.Count; i++)
                {
                    var timestamp = device7.Timestamps[i];
                    var roundedTime = new DateTime(timestamp.Date.Year, timestamp.Date.Month, timestamp.Date.Day, 0, 0, 0); // round time to start of day
                    if (datePowerByDevicePredicitionFor7Day["Predictions For 7 day"].ContainsKey(roundedTime))
                    {
                        datePowerByDevicePredicitionFor7Day["Predictions For 7 day"][roundedTime] += timestamp.PredictedPower;
                    }
                    else
                    {
                        datePowerByDevicePredicitionFor7Day["Predictions For 7 day"].Add(roundedTime, timestamp.PredictedPower);
                    }
                }
            }
            else throw new ArgumentException("Devices is Storage!"); // storage device, error message



            return (datePowerByDevicePredicitionFor1Day, datePowerByDevicePredicitionFor3Day, datePowerByDevicePredicitionFor7Day);
        }

        //ThisMonthConsumption/Production - metoda vraca ukupnu potrosnju/proizvodnju od prvog u mesecu do danasnjeg dana

        public async Task<List<Device>> GetDevicesByCategoryForFirstInMonth(string id, string catStr)
        {
           
            DateTime endDate = DateTime.Now.Date;
            DateTime startDate = new DateTime(endDate.Year,endDate.Month,1); // prvi u mesecu



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
                Timestamps = d.Usage.Timestamps.Where(t => t.Date >= startDate && t.Date <= endDate).ToList(),
            });
            return devicesData.ToList();
        }

        public async Task ToggleActivity(string deviceId, string role)
        {
            var device = await GetProsumerLink(deviceId);
            if (device == null) throw new ArgumentException("Device not found!");
            if (device.DsoControl == false && role != "Prosumer") throw new ArgumentException("You don't have the permission to do that!");

            if ((bool)device.Activity == true) device.Activity = false;
            else device.Activity = true;

            try
            {
                await _regContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw new ArgumentException("Changes could not be saved!");
            }
        }

        public async Task<List<Device>> GetDevicesByCategoryForDate(string id, string catStr, DateTime datetime)
        {
            var begin = datetime + TimeSpan.Zero;
            var end = datetime.Add(DateTime.Now.TimeOfDay);

            if(begin > end)
            {
                var help = begin;
                begin = end;
                end = help;
            }
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
                    t.Date >= begin && t.Date <= end
                ).ToList()
            });
            return devicesData.ToList();
        }
        public async Task<(double, double, string)> TodayAndYesterdayTotalConsumptionAndRatio()
        {
            

            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double consumptionProsumersForThisDay = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {
                
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers) 
            {
                foreach (var device in Prosumerdevices) 
                {
                    foreach (var ts in device.Timestamps) 
                    {
                        if (ts.Power != 0)
                            consumptionProsumersForThisDay += ts.Power;
                    }
                }
            }
            listDevicesbyAllProsumers.Clear();
            double consumptionProsumersForYesterday = 0.0;

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.AddDays(-1).Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.Power != 0)
                            consumptionProsumersForYesterday += ts.Power;
                    }
                }
            }

            if (consumptionProsumersForYesterday == 0 && consumptionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (consumptionProsumersForYesterday == 0)
                return (consumptionProsumersForThisDay, 0.0, "0");
            else if (consumptionProsumersForThisDay == 0)
                return (0, consumptionProsumersForYesterday, "0");
            else
            {

                double ratio = Math.Abs((consumptionProsumersForThisDay - consumptionProsumersForYesterday) / (double)consumptionProsumersForYesterday) * 100;
                ratio = Math.Round(ratio, 2);
                if (consumptionProsumersForYesterday > consumptionProsumersForThisDay)
                    return (consumptionProsumersForThisDay, consumptionProsumersForYesterday, (-ratio).ToString() + "%");
                else
                    return (consumptionProsumersForThisDay, consumptionProsumersForYesterday, ratio.ToString() + "%");
            }



        }
        public async Task<(double, double, string)> TodayAndYesterdayTotalProductionAndRatio()
        {
            

            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double productionProsumersForThisDay = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.Power != 0)
                            productionProsumersForThisDay += ts.Power;
                    }
                }
            }
            
            double productionProsumersForYesterday = 0.0;
            listDevicesbyAllProsumers.Clear();

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.AddDays(-1).Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.Power != 0)
                            productionProsumersForYesterday += ts.Power;
                    }
                }
            }

            if (productionProsumersForYesterday == 0 && productionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (productionProsumersForYesterday == 0)
                return (productionProsumersForThisDay, 0.0, "0");
            else if (productionProsumersForThisDay == 0)
                return (0, productionProsumersForYesterday, "0");
            else
            {

                double ratio = Math.Abs((productionProsumersForThisDay - productionProsumersForYesterday) / (double)productionProsumersForYesterday) * 100;
                ratio = Math.Round(ratio, 2);
                if (productionProsumersForYesterday > productionProsumersForThisDay)
                    return (productionProsumersForThisDay, productionProsumersForYesterday, (-ratio).ToString() + "%");
                else
                    return (productionProsumersForThisDay, productionProsumersForYesterday, ratio.ToString() + "%");
            }



        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalConsumptionAndRatio()
        {


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double predictionconsumptionProsumersForThisDay = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.PredictedPower != 0)
                            predictionconsumptionProsumersForThisDay += ts.PredictedPower;
                    }
                }
            }
            listDevicesbyAllProsumers.Clear();
            double predictionconsumptionProsumersForTomorrow = 0.0;

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.AddDays(+1).Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.PredictedPower != 0)
                            predictionconsumptionProsumersForTomorrow += ts.PredictedPower;
                    }
                }
            }

            if (predictionconsumptionProsumersForTomorrow == 0 && predictionconsumptionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (predictionconsumptionProsumersForTomorrow == 0)
                return (predictionconsumptionProsumersForThisDay, 0.0, "0");
            else if (predictionconsumptionProsumersForThisDay == 0)
                return (0, predictionconsumptionProsumersForTomorrow, "0");
            else
            {

                double ratio = Math.Abs((predictionconsumptionProsumersForThisDay - predictionconsumptionProsumersForTomorrow) / (double)predictionconsumptionProsumersForThisDay) * 100;
                ratio = Math.Round(ratio, 2);
                if (predictionconsumptionProsumersForTomorrow > predictionconsumptionProsumersForThisDay)
                    return (predictionconsumptionProsumersForThisDay, predictionconsumptionProsumersForTomorrow, (-ratio).ToString() + "%");
                else
                    return (predictionconsumptionProsumersForThisDay, predictionconsumptionProsumersForTomorrow, ratio.ToString() + "%");
            }



        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalProductionAndRatio()
        {


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            double predictionproductionProsumersForThisDay = 0.0;


            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.PredictedPower != 0)
                            predictionproductionProsumersForThisDay += ts.PredictedPower;
                    }
                }
            }

            double predictionproductionProsumersForTomorrow = 0.0;
            listDevicesbyAllProsumers.Clear();

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.AddDays(1).Date));
            }



            foreach (var Prosumerdevices in listDevicesbyAllProsumers)
            {
                foreach (var device in Prosumerdevices)
                {
                    foreach (var ts in device.Timestamps)
                    {
                        if (ts.PredictedPower != 0)
                            predictionproductionProsumersForTomorrow += ts.PredictedPower;
                    }
                }
            }

            if (predictionproductionProsumersForTomorrow == 0 && predictionproductionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (predictionproductionProsumersForTomorrow == 0)
                return (predictionproductionProsumersForThisDay, 0.0, "0");
            else if (predictionproductionProsumersForThisDay == 0)
                return (0, predictionproductionProsumersForTomorrow, "0");
            else
            {

                double ratio = Math.Abs((predictionproductionProsumersForThisDay - predictionproductionProsumersForTomorrow) / (double)predictionproductionProsumersForTomorrow) * 100;
                ratio = Math.Round(ratio, 2);
                if (predictionproductionProsumersForTomorrow > predictionproductionProsumersForThisDay)
                    return (predictionproductionProsumersForThisDay, predictionproductionProsumersForTomorrow, (-ratio).ToString() + "%");
                else
                    return (predictionproductionProsumersForThisDay, predictionproductionProsumersForTomorrow, ratio.ToString() + "%");
            }



        }

    }
}
