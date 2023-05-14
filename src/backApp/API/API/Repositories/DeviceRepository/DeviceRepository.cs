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
using MongoDB.Bson;
using Amazon.Runtime.Internal.Util;

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
   
         public async Task<List<List<Device>>> GetDevices(string id)
         {
             var linkInfo = await GetLinksForProsumer(id);
             var links = linkInfo.Select(x => x.ModelId);

             var filter = Builders<DevicePower>.Filter.In(x => x.DeviceId, links);        
             var usageData = await _usageContext.PowerUsage.Find(filter).ToListAsync();


             var specs = await _regContext.Devices.ToListAsync();

             // Join the data from both queries to create a list of Device objects
             var devices = from usage in usageData
                           join spec in specs on usage.DeviceId equals spec.Id
                           join link in linkInfo on spec.Id equals link.ModelId
                           select new { Usage = usage, Spec = spec, Link = link };


             var devicesData = devices.Select(d => new Device
             {
                 Id = d.Link.Id,
                 IpAddress = d.Link.IpAddress,
                 Name = d.Link.Name,
                 ModelId = d.Spec.Id,
                 TypeId = d.Spec.TypeId,
                 CategoryId = d.Spec.CategoryId,
                 Manufacturer = d.Spec.Manufacturer,
                 Wattage = d.Spec.Wattage,
                 Activity = d.Link.Activity,
                 DsoView = d.Link.DsoView,
                 DsoControl = d.Link.DsoControl,
                 Timestamps = d.Usage.Timestamps.Where(t =>
                        t.Date.Year == DateTime.Now.Year &&
                        t.Date.Month == DateTime.Now.Month &&
                        t.Date.Day == DateTime.Now.Day &&
                        t.Date.Hour == DateTime.Now.Hour
                    ).ToList()
             });
             return new List<List<Device>> { devicesData.Where(x => x.CategoryId == 1).ToList(), devicesData.Where(x => x.CategoryId == 2).ToList(), devicesData.Where(x => x.CategoryId == 3).ToList() };

         }

        public async Task<List<Device>> GetDevicesByCategoryForAPeriod(string id, string catStr, int period)
        {
            var linkInfo = await GetLinksForProsumer(id);
            
            var cat = await GetDeviceCategory(catStr);
            var models = await _regContext.Devices.Where(x => x.CategoryId == cat).Select(x => x.Id).ToListAsync();
            var links = linkInfo.Where(x => models.Contains(x.ModelId)).Select(x => x.ModelId);

            var usages = _usageContext.PowerUsage
             .AsQueryable()
             .Where(d => links.Contains(d.DeviceId))
             .SelectMany(d => d.Timestamps, (d, t) => new { d.DeviceId, Timestamp = t })
             .Where(t => t.Timestamp.Date >= DateTime.Now.AddDays(period) && t.Timestamp.Date <= DateTime.Now ||
                         t.Timestamp.Date <= DateTime.Now.AddDays(period) && t.Timestamp.Date >= DateTime.Now)
             .GroupBy(t => t.DeviceId)
             .Select(g => new { DeviceId = g.Key, Timestamps = g.Select(x => x.Timestamp).ToList() });


            var devicesData = usages.Select(d => new Device
            {
                Id = d.DeviceId,
                Timestamps = d.Timestamps
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

        // svi Prosumeri koji imaju uredjaje

        public async Task<List<ProsumerLink>> getAllProsumersWhoOwnDevice()
        {

            return await _regContext.ProsumerLinks.ToListAsync();
        }
        // zbiran potrosnja energije za korisnike za nedelju dana
        public async Task<double> ConsumptionForLastWeekForAllProsumers()
        {
        
            return (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .SelectMany(p => GetDevicesByCategoryForAPeriod(p.ProsumerId, "Consumer", -7).Result)
                .SelectMany(d => d.Timestamps)
                .Where(ts => ts.Power != 0)
                .Sum(ts => ts.Power);
        }

        // zbiran proizvodnja energije za korisnike za nedelju dana
        public async Task<double> ProductionForLastWeekForAllProsumers()
        {
           return (await getAllProsumersWhoOwnDevice())
            .GroupBy(x => x.ProsumerId)
            .Select(g => g.First())
            .SelectMany(p => GetDevicesByCategoryForAPeriod(p.ProsumerId, "Producer", -7).Result)
            .SelectMany(d => d.Timestamps)
            .Where(ts => ts.Power != 0)
            .Sum(ts => ts.Power);
        }

        public async Task<int> ProsumerDeviceCount(string id)
        {
            var links = await GetLinksForProsumer(id);
            int count = links.Count();

            return count;
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

            var usage = await _usageContext.PowerUsage.Find(x => deviceinfo.Id.Equals(x.DeviceId)).FirstOrDefaultAsync();

            var device = new Device
            {
                Id = deviceinfo.Id,
                //IpAddress = deviceinfo.IpAddress,
                Name = deviceinfo.Name,
                TypeId = deviceinfo.TypeId,
                CategoryId = deviceinfo.CategoryId,
                Manufacturer = deviceinfo.Manufacturer,
                Wattage = deviceinfo.Wattage,
                Timestamps = usage?.Timestamps.FindAll(t =>
                    t.Date >= DateTime.Now.AddDays(period) && t.Date <= DateTime.Now ||
                    t.Date <= DateTime.Now.AddDays(period) && t.Date >= DateTime.Now)
            };

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

            Dictionary<DateTime, double> timestamps = device.Timestamps
                .GroupBy(t => t.Date.Date)
                .ToDictionary(g => g.Key, g => g.Sum(t => t.Power));

            Dictionary<DateTime, double> predictions = device.Timestamps
                .GroupBy(t => t.Date.Date)
                .ToDictionary(g => g.Key, g => g.Sum(t => t.PredictedPower));

            return new Dictionary<string, Dictionary<DateTime, double>>()
            {
                 { "timestamps", timestamps },
                { "predictions", predictions }
             };
        }


        public async Task<Dictionary<string, object>> GetDevice(string id)
        {
            var link = await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == id);
            var info = await _regContext.Devices.FirstOrDefaultAsync(x => x.Id == link.ModelId);
            var usage = await _usageContext.PowerUsage.Find(x => x.DeviceId == link.ModelId).FirstOrDefaultAsync();
            Timestamp ts = usage.Timestamps.Where(x => x.Date.Year ==  DateTime.Now.Year && x.Date.Month == DateTime.Now.Month && x.Date.Day == DateTime.Now.Day && x.Date.Hour == DateTime.Now.Hour).FirstOrDefault();
            double currentUsage = Math.Round(ts.Power, 4);
            double max = await MaxUsage(link.ModelId);
            
            double curr;
            double avg = await AvgUsage(link.ModelId);
            if (info.CategoryId == 3) curr = currentUsage;
            else
            { 
                if (link.Activity > 0)
                {
                    if (info.TypeId == 19 && (DateTime.Now.TimeOfDay < TimeSpan.FromHours(6) || DateTime.Now.TimeOfDay > TimeSpan.FromHours(18))) curr = 0;
                    else
                    {
                        if (currentUsage == 0) curr = avg * 0.85;
                        else curr = currentUsage;
                        
                    }
                }
                else curr = 0;
            }

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
                { "CurrentUsage", Math.Round(curr, 2)},
                { "CategoryName", (await GetDeviceCat(info.CategoryId)).Name },
                { "TypeName", (await GetDeviceType(info.TypeId)).Name },
                { "MaxUsage", Math.Round(max, 2)},
                { "AvgUsage", Math.Round(avg, 2)},
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
            if (device == null) return;

            var updated = false;

            if (!string.IsNullOrEmpty(model)) { device.ModelId = model; updated = true; }
            if (!string.IsNullOrEmpty(DeviceName)) { device.Name = DeviceName; updated = true; }
            if (!string.IsNullOrEmpty(IpAddress)) { device.IpAddress = IpAddress; updated = true; }
            if (device.DsoView != dsoView) { device.DsoView = dsoView; updated = true; }
            if (device.DsoControl != dsoControl) { device.DsoControl = dsoControl; updated = true; }

            if (updated) await _regContext.SaveChangesAsync();
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
            
            var (thismonday, thisday) = GetCurrentWeekDates();
            var thisWeek = new List<DateTime> { thismonday, thisday };

            var (pastmonday, pastday) = GetPastWeekDates();
            var lastWeek = new List<DateTime> { pastmonday, pastday };

            var prosumerIds = (await getAllProsumersWhoOwnDevice())
                .Select(x => x.ProsumerId)
                .Distinct()
                .ToList();

            var consumptionProsumersForThisWeek = 0.0;
            var consumptionProsumersForLastWeek = 0.0;

            foreach (var prosumerId in prosumerIds)
            {
                var devicesForThisWeek = await GetDevicesByCategoryForThisPastFutureWeek(prosumerId, "Consumer", "this");
                consumptionProsumersForThisWeek += devicesForThisWeek
                    .SelectMany(device => device.Timestamps)
                    .Where(ts => ts.Power != 0)
                    .Sum(ts => ts.Power);

                var devicesForLastWeek = await GetDevicesByCategoryForThisPastFutureWeek(prosumerId, "Consumer", "past");
                consumptionProsumersForLastWeek += devicesForLastWeek
                    .SelectMany(device => device.Timestamps)
                    .Where(ts => ts.Power != 0)
                    .Sum(ts => ts.Power);
            }

            if (consumptionProsumersForLastWeek == 0 && consumptionProsumersForThisWeek == 0)
                return (0.0, 0.0, "0", thisWeek, lastWeek);
            else if (consumptionProsumersForLastWeek == 0)
                return (consumptionProsumersForThisWeek, 0.0, "0", thisWeek, lastWeek);
            else if (consumptionProsumersForThisWeek == 0)
                return (0.0, consumptionProsumersForLastWeek, "0", thisWeek, lastWeek);
            else
            {
                var ratio = Math.Round(Math.Abs((consumptionProsumersForThisWeek - consumptionProsumersForLastWeek) / consumptionProsumersForLastWeek * 100), 2);
                var percentageChange = consumptionProsumersForLastWeek > consumptionProsumersForThisWeek
                    ? (-ratio).ToString("0.##") + " %"
                    : (ratio).ToString("0.##") + " %";

                return (consumptionProsumersForThisWeek, consumptionProsumersForLastWeek, percentageChange, thisWeek, lastWeek);
            }
        }
        public async Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalProduction()
        {
            var (thisMonday, thisDay) = GetCurrentWeekDates();
            var thisWeek = new List<DateTime> { thisMonday, thisDay };

            var (pastMonday, pastDay) = GetPastWeekDates();
            var lastWeek = new List<DateTime> { pastMonday, pastDay };

            var prosumerIds = (await getAllProsumersWhoOwnDevice())
                .Select(x => x.ProsumerId)
                .Distinct()
                .ToList();

            var productionProsumersForThisWeek = 0.0;
            var productionProsumersForLastWeek = 0.0;

            foreach (var prosumerId in prosumerIds)
            {
                var devicesForThisWeek = await GetDevicesByCategoryForThisPastFutureWeek(prosumerId, "Producer", "this");
                productionProsumersForThisWeek += devicesForThisWeek
                    .SelectMany(device => device.Timestamps)
                    .Where(ts => ts.Power != 0)
                    .Sum(ts => ts.Power);

                var devicesForLastWeek = await GetDevicesByCategoryForThisPastFutureWeek(prosumerId, "Producer", "past");
                productionProsumersForLastWeek += devicesForLastWeek
                    .SelectMany(device => device.Timestamps)
                    .Where(ts => ts.Power != 0)
                    .Sum(ts => ts.Power);
            }

            if (productionProsumersForLastWeek == 0 && productionProsumersForThisWeek == 0)
                return (0.0, 0.0, "0", thisWeek, lastWeek);
            else if (productionProsumersForLastWeek == 0)
                return (productionProsumersForThisWeek, 0.0, "0", thisWeek, lastWeek);
            else if (productionProsumersForThisWeek == 0)
                return (0.0, productionProsumersForLastWeek, "0", thisWeek, lastWeek);
            else
            {
                var ratio = Math.Round(Math.Abs((productionProsumersForThisWeek - productionProsumersForLastWeek) / productionProsumersForLastWeek * 100), 2);
                var percentageChange = productionProsumersForLastWeek > productionProsumersForThisWeek
                    ? (-ratio).ToString("0.##") + " %"
                    : (ratio).ToString("0.##") + " %";

                return (productionProsumersForThisWeek, productionProsumersForLastWeek, percentageChange, thisWeek, lastWeek);
            }
        }

        public async Task<double> NextWeekTotalPredictedProduction()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();


            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Producer", "future"));
            }

            double productionProsumersForNextWeekPrediction = listDevicesbyAllProsumers
                .SelectMany(devices => devices)
                .SelectMany(device => device.Timestamps)
                .AsParallel()
                .Where(ts => ts.PredictedPower != 0)
                .Sum(ts => ts.PredictedPower);

            return productionProsumersForNextWeekPrediction;
        }
        public async Task<double> NextWeekTotalPredictedConsumption()
        {
            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                .GroupBy(x => x.ProsumerId)
                .Select(g => g.First())
                .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();
           


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForThisPastFutureWeek(prosumer.ProsumerId, "Consumer", "future"));
            }


            double consumptionProsumersForNextWeekPrediction = listDevicesbyAllProsumers
               .SelectMany(devices => devices)
               .SelectMany(device => device.Timestamps)
               .AsParallel()
               .Where(ts => ts.PredictedPower != 0)
               .Sum(ts => ts.PredictedPower);

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

            var id = (await _regContext.ProsumerLinks.FirstOrDefaultAsync(x => x.Id == idDevice))?.ModelId;

            if (id == null)
                throw new ArgumentException("Invalid device id.");


            DeviceInfo deviceInfo = await GetDeviceInfoById(id);

            Device device1 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 1); // one day
            Device device3 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 3); // for two days
            Device device7 = await GetDeviceByCategoryForAPeriodForDays(deviceInfo, 7); // for seven days

            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredictionFor1Day = new Dictionary<string, Dictionary<DateTime, double>>()
            {

                { "PredictionsFor1day", new Dictionary<DateTime, double>() }

            };

            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredictionFor3Day = new Dictionary<string, Dictionary<DateTime, double>>()
            {

            { "PredictionsFor3day", new Dictionary<DateTime, double>() }

            };

            Dictionary<string, Dictionary<DateTime, double>> datePowerByDevicePredictionFor7Day = new Dictionary<string, Dictionary<DateTime, double>>()
            {

            { "PredictionsFor7day", new Dictionary<DateTime, double>() }

            };



            foreach (var timestamp in device1.Timestamps)
            {
                var roundedTime = timestamp.Date.AddMinutes(-(timestamp.Date.Minute % 60)); // round the time to the nearest hour

                if (datePowerByDevicePredictionFor1Day["PredictionsFor1day"].TryGetValue(roundedTime, out double power))
                    datePowerByDevicePredictionFor1Day["PredictionsFor1day"][roundedTime] = power + timestamp.PredictedPower;
                else
                    datePowerByDevicePredictionFor1Day["PredictionsFor1day"].Add(roundedTime, timestamp.PredictedPower);
            }

            var tempDict1 = datePowerByDevicePredictionFor1Day["PredictionsFor1day"].ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            datePowerByDevicePredictionFor1Day["PredictionsFor1day"] = tempDict1;





           



            foreach (var timestamp in device3.Timestamps)
            {

                var roundedDate = timestamp.Date.Date;

                if (datePowerByDevicePredictionFor3Day["PredictionsFor3day"].TryGetValue(roundedDate, out double power))
                     datePowerByDevicePredictionFor3Day["PredictionsFor3day"][roundedDate] = power + timestamp.PredictedPower;
              
                else
                    datePowerByDevicePredictionFor3Day["PredictionsFor3day"].Add(roundedDate, timestamp.PredictedPower);

            }



            foreach (var timestamp in device7.Timestamps)
            {

                var roundedDate = timestamp.Date.Date;

                if (datePowerByDevicePredictionFor7Day["PredictionsFor7day"].TryGetValue(roundedDate, out double power))
                    datePowerByDevicePredictionFor7Day["PredictionsFor7day"][roundedDate] = power + timestamp.PredictedPower;

                else
                    datePowerByDevicePredictionFor7Day["PredictionsFor7day"].Add(roundedDate, timestamp.PredictedPower);

            }

            return (datePowerByDevicePredictionFor1Day, datePowerByDevicePredictionFor3Day, datePowerByDevicePredictionFor7Day);

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

            if (device.Activity > 0) device.Activity = 0;
            else device.Activity = 1;

            try
            {
                await _regContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw new ArgumentException("Changes could not be saved!");
            }
        }

        public async Task<List<Device>> GetDevicesByCategoryForDateRealTime(string id, string catStr, DateTime datetime)
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
        public async Task<List<Device>> GetDevicesByCategoryForDate(string id, string catStr, DateTime datetime)
        {
            var begin = datetime + TimeSpan.Zero;
            var end = datetime + new TimeSpan(23, 59, 59);

            if (begin > end)
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
         


            foreach (var prosumer in prosumersWithDevices)
            {
                
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDateRealTime(prosumer.ProsumerId, "Consumer", DateTime.Now.Date));
            }

            double consumptionProsumersForThisDay = listDevicesbyAllProsumers
            .SelectMany(devices => devices)
            .SelectMany(device => device.Timestamps)
            .Where(ts => ts.Power != 0)
            .Sum(ts => ts.Power);

            listDevicesbyAllProsumers.Clear();
         

            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDateRealTime(prosumer.ProsumerId, "Consumer", DateTime.Now.AddDays(-1).Date));
            }



            double consumptionProsumersForYesterday = listDevicesbyAllProsumers
             .SelectMany(devices => devices)
             .SelectMany(device => device.Timestamps)
             .Where(ts => ts.Power != 0)
             .Sum(ts => ts.Power);

           
            
            if (consumptionProsumersForYesterday == 0 && consumptionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (consumptionProsumersForYesterday == 0)
                return (consumptionProsumersForThisDay, 0.0, "0");
            else if (consumptionProsumersForThisDay == 0)
                return (0, consumptionProsumersForYesterday, "0");
            else
            {
                double ratio = Math.Abs((consumptionProsumersForThisDay - consumptionProsumersForYesterday) / consumptionProsumersForYesterday) * 100;
                ratio = Math.Round(ratio, 2);
                return (consumptionProsumersForThisDay, consumptionProsumersForYesterday, $"{(consumptionProsumersForYesterday > consumptionProsumersForThisDay ? "-" : "+")}{ratio}%");
            }
        }
        public async Task<(double, double, string)> TodayAndYesterdayTotalProductionAndRatio()
        {


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();



            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDateRealTime(prosumer.ProsumerId, "Producer", DateTime.Now.Date));
            }

            double productionForThisDay = listDevicesbyAllProsumers
            .SelectMany(devices => devices)
            .SelectMany(device => device.Timestamps)
            .Where(ts => ts.Power != 0)
            .Sum(ts => ts.Power);

            listDevicesbyAllProsumers.Clear();


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDateRealTime(prosumer.ProsumerId, "Producer", DateTime.Now.AddDays(-1).Date));
            }



            double productionProsumersForYesterday = listDevicesbyAllProsumers
             .SelectMany(devices => devices)
             .SelectMany(device => device.Timestamps)
             .Where(ts => ts.Power != 0)
             .Sum(ts => ts.Power);



            if (productionProsumersForYesterday == 0 && productionForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (productionProsumersForYesterday == 0)
                return (productionForThisDay, 0.0, "0");
            else if (productionForThisDay == 0)
                return (0, productionProsumersForYesterday, "0");
            else
            {
                double ratio = Math.Abs((productionForThisDay - productionProsumersForYesterday) / productionProsumersForYesterday) * 100;
                ratio = Math.Round(ratio, 2);
                return (productionForThisDay, productionProsumersForYesterday, $"{(productionProsumersForYesterday > productionForThisDay ? "-" : "+")}{ratio}%");
            }

        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalConsumptionAndRatio()
        {


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();



            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.Date));
            }

            double predictedconsumptionProsumersForThisDay = listDevicesbyAllProsumers
            .SelectMany(devices => devices)
            .SelectMany(device => device.Timestamps)
            .Where(ts => ts.PredictedPower != 0)
            .Sum(ts => ts.PredictedPower);

            listDevicesbyAllProsumers.Clear();


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Consumer", DateTime.Now.AddDays(+1).Date));
            }



            double predictedconsumptionProsumersForTomorrow = listDevicesbyAllProsumers
             .SelectMany(devices => devices)
             .SelectMany(device => device.Timestamps)
             .Where(ts => ts.PredictedPower != 0)
             .Sum(ts => ts.PredictedPower);



            if (predictedconsumptionProsumersForTomorrow == 0 && predictedconsumptionProsumersForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (predictedconsumptionProsumersForTomorrow == 0)
                return (predictedconsumptionProsumersForThisDay, 0.0, "0");
            else if (predictedconsumptionProsumersForThisDay == 0)
                return (0, predictedconsumptionProsumersForTomorrow, "0");
            else
            {
                double ratio = Math.Abs((predictedconsumptionProsumersForThisDay - predictedconsumptionProsumersForTomorrow) / predictedconsumptionProsumersForTomorrow) * 100;
                ratio = Math.Round(ratio, 2);
                return (predictedconsumptionProsumersForThisDay, predictedconsumptionProsumersForTomorrow, $"{(predictedconsumptionProsumersForTomorrow > predictedconsumptionProsumersForThisDay ? "-" : "+")}{ratio}%");
            }


        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalProductionAndRatio()
        {


            List<ProsumerLink> prosumersWithDevices = (await getAllProsumersWhoOwnDevice())
                 .GroupBy(x => x.ProsumerId)
                 .Select(g => g.First())
                 .ToList();

            List<List<Device>> listDevicesbyAllProsumers = new List<List<Device>>();



            foreach (var prosumer in prosumersWithDevices)
            {

                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.Date));
            }

            double predictedproductionForThisDay = listDevicesbyAllProsumers
            .SelectMany(devices => devices)
            .SelectMany(device => device.Timestamps)
            .Where(ts => ts.PredictedPower != 0)
            .Sum(ts => ts.PredictedPower);

            listDevicesbyAllProsumers.Clear();


            foreach (var prosumer in prosumersWithDevices)
            {
                listDevicesbyAllProsumers.Add(await GetDevicesByCategoryForDate(prosumer.ProsumerId, "Producer", DateTime.Now.AddDays(+1).Date));
            }



            double predictedproductionProsumersForTomorrow = listDevicesbyAllProsumers
             .SelectMany(devices => devices)
             .SelectMany(device => device.Timestamps)
             .Where(ts => ts.PredictedPower != 0)
             .Sum(ts => ts.PredictedPower);



            if (predictedproductionProsumersForTomorrow == 0 && predictedproductionForThisDay == 0)
                return (0.0, 0.0, "0");
            else if (predictedproductionProsumersForTomorrow == 0)
                return (predictedproductionForThisDay, 0.0, "0");
            else if (predictedproductionForThisDay == 0)
                return (0, predictedproductionProsumersForTomorrow, "0");
            else
            {
                double ratio = Math.Abs((predictedproductionForThisDay - predictedproductionProsumersForTomorrow) / predictedproductionProsumersForTomorrow) * 100;
                ratio = Math.Round(ratio, 2);
                return (predictedproductionForThisDay, predictedproductionProsumersForTomorrow, $"{(predictedproductionProsumersForTomorrow > predictedproductionForThisDay ? "-" : "+")}{ratio}%");
            }

        }

        public async Task ToggleStorageActivity(string deviceId, string role, int state)
        {
            var device = await GetProsumerLink(deviceId);
            if (device == null) throw new ArgumentException("Device not found!");
            if (device.DsoControl == false && role != "Prosumer") throw new ArgumentException("You don't have the permission to do that!");

            device.Activity = state;

            try
            {
                await _regContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw new ArgumentException("Changes could not be saved!");
            }
        }

    }
}
