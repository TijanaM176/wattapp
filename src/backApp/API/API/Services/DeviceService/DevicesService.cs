using Amazon.Runtime.Internal.Transform;
using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;
using API.Repositories.DeviceRepository;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Data;

namespace API.Services.Devices
{
    public class DevicesService : IDevicesService
    {
        private readonly IDeviceRepository _repository;

        public DevicesService(IDeviceRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Dictionary<string, object>>> GetDevicesByCategory(string id, string catStr)
        {
            var devices = await _repository.GetDevicesByCategory(id, catStr);
            if (devices == null) throw new ArgumentException("No devices found!");
            
            var devicesData = devices.Select(d => new Dictionary<string, object>
            {
                { "Id", d.Id  },
                { "IpAddress", d.IpAddress },
                { "Name", d.Name },
                { "TypeId", d.TypeId},
                { "CategoryId", d.CategoryId},
                { "Manufacturer", d.Manufacturer},
                { "Wattage", d.Wattage},
                { "Timestamps", d.Timestamps.Select(x => new { Date = x.Date, ActivePower = x.ActivePower, ReactivePower = x.ReactivePower}).FirstOrDefault() },
                { "Predictions", d.Predictions.Select(x => new { Date = x.Date, ActivePower = x.ActivePower, ReactivePower = x.ReactivePower}).FirstOrDefault() },
            });
            return devicesData.ToList();
        }

        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            return await _repository.CurrentConsumptionForProsumer(id);
        }

        public async Task<double> CurrentProductionForProsumer(string id)
        {
            return await _repository.CurrentProductionForProsumer(id);
        }

        public async Task<Dictionary<string,Dictionary<DateTime, double>>> ConsumptionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Consumer", period);
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var dev in devices)
            {
                for (int i = 0; i < dev.Timestamps.Count; i++)
                {
                    var timestamp = dev.Timestamps[i];
                    var prediction = dev.Predictions[i];
                    if (data["timestamps"].ContainsKey(timestamp.Date)) { 
                        data["timestamps"][timestamp.Date] += timestamp.ActivePower + timestamp.ReactivePower;
                        data["predictions"][timestamp.Date] += prediction.ActivePower + prediction.ReactivePower;
                    }
                    else
                    {
                        data["timestamps"].Add(timestamp.Date, timestamp.ActivePower + timestamp.ReactivePower);
                        data["predictions"].Add(timestamp.Date, prediction.ActivePower + prediction.ReactivePower);
                    }
                }
            }

            return data;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ProductionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Producer", period);
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var dev in devices)
            {
                for (int i = 0; i < dev.Timestamps.Count; i++)
                {
                    var timestamp = dev.Timestamps[i];
                    var prediction = dev.Predictions[i];
                    if (data["timestamps"].ContainsKey(timestamp.Date))
                    {
                        data["timestamps"][timestamp.Date] += timestamp.ActivePower;
                        data["predictions"][timestamp.Date] += prediction.ActivePower;
                    }
                    else
                    {
                        data["timestamps"].Add(timestamp.Date, timestamp.ActivePower);
                        data["predictions"].Add(timestamp.Date, prediction.ActivePower);
                    }
                }
            }

            return data;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step)  //type 0 ako je consumption, 1 production
        {
            Dictionary<string, Dictionary<DateTime, double>> all;
            if (type == 0)
                all = await ConsumptionForAPeriodForProsumer(id, period);
            else
                all = await ProductionForAPeriodForProsumer(id, period);

            Dictionary<string, Dictionary<DateTime, double>> grouped = new Dictionary<string, Dictionary<DateTime, double>> ();
            grouped["timestamps"] = new Dictionary<DateTime, double>();
            grouped["predictions"] = new Dictionary<DateTime, double>();

            var ts = all["timestamps"];
            foreach (KeyValuePair<DateTime, double> pair in ts)
            {
                var intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                 if (grouped["timestamps"].ContainsKey(intervalStart))
                    grouped["timestamps"][intervalStart] += pair.Value;
                else
                    grouped["timestamps"].Add(intervalStart, pair.Value);
            }

            var pr = all["predictions"];
            foreach (KeyValuePair<DateTime, double> pair in pr)
            {
                var intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                if (grouped["predictions"].ContainsKey(intervalStart))
                    grouped["predictions"][intervalStart] += pair.Value;
                else
                    grouped["predictions"].Add(intervalStart, pair.Value);
            }
            
            return grouped;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> LastMonthsGroupedConProdByWeekForProsumer(string id, int type)  //type 0 ako je consumption, 1 production
        {
            Dictionary<string, Dictionary<DateTime, double>> all;
            if (type == 0)
                all = await ConsumptionForAPeriodForProsumer(id, -30);
            else
                all = await ProductionForAPeriodForProsumer(id, -30);

            Dictionary<string, Dictionary<DateTime, double>> grouped = new Dictionary<string, Dictionary<DateTime, double>>();
            grouped["timestamps"] = new Dictionary<DateTime, double>();
            grouped["predictions"] = new Dictionary<DateTime, double>();

            var ts = all["timestamps"];
            foreach (KeyValuePair<DateTime, double> pair in ts)
            {
                var intervalStart = pair.Key.AddDays(-(int)pair.Key.DayOfWeek).Date;
                intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                if (grouped["timestamps"].ContainsKey(intervalStart))
                    grouped["timestamps"][intervalStart] += pair.Value;
                else
                    grouped["timestamps"].Add(intervalStart, pair.Value);
            }

            var pr = all["predictions"];
            foreach (KeyValuePair<DateTime, double> pair in pr)
            {
                var intervalStart = pair.Key.AddDays(-(int)pair.Key.DayOfWeek).Date;
                intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                if (grouped["predictions"].ContainsKey(intervalStart))
                    grouped["predictions"][intervalStart] += pair.Value;
                else
                    grouped["predictions"].Add(intervalStart, pair.Value);
            }

            return grouped;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> LastYearsGroupedConProdByMonthForProsumer(string id, int type)  //type 0 ako je consumption, 1 production
        {
            Dictionary<string, Dictionary<DateTime, double>> all;
            if (type == 0)
                all = await ConsumptionForAPeriodForProsumer(id, -365);
            else
                all = await ProductionForAPeriodForProsumer(id, -365);

            Dictionary<string, Dictionary<DateTime, double>> grouped = new Dictionary<string, Dictionary<DateTime, double>>();
            grouped["timestamps"] = new Dictionary<DateTime, double>();
            grouped["predictions"] = new Dictionary<DateTime, double>();

            var ts = all["timestamps"];
            foreach (KeyValuePair<DateTime, double> pair in ts)
            {
                var intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                if (grouped["timestamps"].ContainsKey(intervalStart))
                    grouped["timestamps"][intervalStart] += pair.Value;
                else
                    grouped["timestamps"].Add(intervalStart, pair.Value);
            }

            var pr = all["predictions"];
            foreach (KeyValuePair<DateTime, double> pair in pr)
            {
                var intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                if (grouped["predictions"].ContainsKey(intervalStart))
                    grouped["predictions"][intervalStart] += pair.Value;
                else
                    grouped["predictions"].Add(intervalStart, pair.Value);
            }

            return grouped;
        }

        public async Task<double> ConsumptionForLastWeekForAllProsumers()
        {
            return await _repository.ConsumptionForLastWeekForAllProsumers();
        }
        public async Task<double> ProductionForLastWeekForAllProsumers()
        {
            return await _repository.ProductionForLastWeekForAllProsumers();
        }

        //izbaciti
        public async Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            var prosumers = await _repository.ProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount);
            if (prosumers == null) throw new ArgumentException("No users fit that criteria!");
            return prosumers;
        }

        //izbaciti
        public async Task<List<Prosumer>> ProsumerFilter2(string neighbourhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            var prosumers = await ProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount);
            var filteredProsumers = prosumers.Where(x => x.NeigborhoodId == neighbourhood).ToList();
            return filteredProsumers;
        }
        public async Task<DeviceInfo> GetDeviceInfoById(string id)
        {
            var deviceinfo = await _repository.GetDeviceInfoById(id);
            if (deviceinfo == null)
                throw new ArgumentException("No devices with that id!");
            return deviceinfo;
        }
        public async Task<Dictionary<DateTime, double>> ProductionConsumptionForLastWeekForDevice(string idDevice)
        {

            var prodCon = await _repository.ProductionConsumptionForLastWeekForDevice(idDevice);
            if (prodCon == null) throw new ArgumentException("No data for this device!");
            return prodCon;
        }
        public async Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice)
        {

            return await _repository.getDeviceCategoryEnum(idDevice);
        }

        public async Task<Dictionary<string, object>> GetDevice(string id)
        {
            var device = await _repository.GetDevice(id);
            if (device == null) throw new ArgumentException("No device with that id!");
            return device;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdForAPeriodTimestamps(int type, int period, int step)     //type 0 cons 1 prod
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await GroupedConProdForAPeriodForProsumer(prosumer, type, period, step);

                foreach (var cat in usagePerProsumer)
                {
                    data[cat.Key] = new Dictionary<DateTime, double>();
                    foreach (var timestamp in cat.Value)
                    {
                        var intervalStart = new DateTime(timestamp.Key.Year, timestamp.Key.Month, timestamp.Key.Day, (timestamp.Key.Hour / step) * step, 0, 0);
                        if (data[cat.Key].ContainsKey(intervalStart))
                            data[cat.Key][intervalStart] += timestamp.Value;
                        else
                            data[cat.Key].Add(intervalStart, timestamp.Value);
                    }
                }
            }

            if (data == null) throw new ArgumentException("No timestamps!");
            return data;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdByWeekTimestamps(int type)     //type 0 cons 1 prod
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await LastMonthsGroupedConProdByWeekForProsumer(prosumer, type);
                
                foreach (var cat in usagePerProsumer)
                {
                    data[cat.Key] = new Dictionary<DateTime, double>();
                    foreach (var timestamp in cat.Value)
                    {
                        var intervalStart = timestamp.Key.AddDays(-(int)timestamp.Key.DayOfWeek).Date;
                        intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                        if (data[cat.Key].ContainsKey(intervalStart))
                            data[cat.Key][intervalStart] += timestamp.Value;
                        else
                            data[cat.Key].Add(intervalStart, timestamp.Value);
                    }
                }
            }

            return data;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdByMonthTimestamps(int type)     //type 0 cons 1 prod
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await LastYearsGroupedConProdByMonthForProsumer(prosumer, type);

                foreach (var cat in usagePerProsumer)
                {
                    data[cat.Key] = new Dictionary<DateTime, double>();
                    foreach (var timestamp in cat.Value)
                    {
                        var intervalStart = new DateTime(timestamp.Key.Year, timestamp.Key.Month, 1);
                        if (data[cat.Key].ContainsKey(intervalStart))
                            data[cat.Key][intervalStart] += timestamp.Value;
                        else
                            data[cat.Key].Add(intervalStart, timestamp.Value);
                    }
                }
            }

            return data;
        }

        public async Task<double> TotalCurrentConsumption()
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            double consumption = 0;
            foreach (var prosumer in prosumers)
            {
                consumption += await CurrentConsumptionForProsumer(prosumer);
            }
            return consumption;
        }

        public async Task<double> TotalCurrentProduction()
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            double production = 0;
            foreach (var prosumer in prosumers)
            {
                production += await CurrentProductionForProsumer(prosumer);
            }
            return production;
        }

        public async Task<Dictionary<string, object>> GetProsumerInformation(string id)
        {
            var prosumer = await _repository.GetProsumer(id);
            var cons = await CurrentConsumptionForProsumer(id);
            var prod = await CurrentProductionForProsumer(id);
            var devCount = await _repository.ProsumerDeviceCount(id);

            return new Dictionary<string, object> {
                { "id", id },
                { "username", prosumer.Username },
                { "address", prosumer.Address },
                { "neighborhoodId", prosumer.NeigborhoodId },
                { "lat", prosumer.Latitude },
                { "long", prosumer.Longitude },
                { "image", prosumer.Image },
                { "consumption", cons },
                { "production", prod },
                { "devCount", devCount }
            };  
        }

        public async Task<List<Dictionary<string, object>>> AllProsumerInfo()
        {
            var prosumers = (await _repository.GetProsumers()).Select(x => x.Id);
            List<Dictionary<string, object>> info = new List<Dictionary<string, object>>();

            foreach (var prosumer in prosumers)
                info.Add(await GetProsumerInformation(prosumer));

            return info;
        }

        public async Task<List<Dictionary<string, object>>> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            var list = (await AllProsumerInfo()).Where(x => 
                (double)x["consumption"] >= minConsumption/1000 && (double)x["consumption"] <= maxConsumption/1000 &&
                (double)x["production"] >= minProduction/1000 && (double)x["production"] <= maxProduction/1000 &&
                (double)x["devCount"] >= minDeviceCount && (double)x["devCount"] <= maxDeviceCount
                ).ToList();

            return list;

        }

        public async Task<List<Dictionary<string, object>>> UpdatedProsumerFilter2(string neighbourhood,
            double minConsumption, double maxConsumption, double minProduction, double maxProduction,
            int minDeviceCount, int maxDeviceCount)
        {
            return (await UpdatedProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction,
                minDeviceCount, maxDeviceCount)).Where(x => x["neighborhoodId"].ToString() == neighbourhood).ToList();
        }

        public async Task<bool> EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl)
        {
            try
            {
                await _repository.EditDevice(IdDevice, model, DeviceName, IpAddress, dsoView, dsoControl);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }
        public async Task<Boolean> DeleteDevice(string idDevice)
        {
            var deviceinfo = await _repository.DeleteDevice(idDevice);
            if (deviceinfo == false)
                throw new ArgumentException("No devices with that id!");


            return deviceinfo;

        }

        public async Task<bool> RegisterDevice(string prosumerId, string modelId, string name, bool dsoView, bool dsoControl)
        {
            Guid id = Guid.NewGuid();
            string ip = await GenerateIP(prosumerId);

            if (await InsertLink(new ProsumerLink
            {
                Id = id.ToString(),
                Name = name,
                ProsumerId = prosumerId,
                ModelId = modelId,
                IpAddress = ip,
                DsoView = dsoView,
                DsoControl = dsoControl
            })
            ) return true;

            return false;
        }
        public async Task<bool> InsertLink(ProsumerLink link)
        {
            try
            {
                await _repository.InsertLink(link);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<string> GenerateIP(string prosumerId)
        {
            var addresses = (await _repository.GetLinksForProsumer(prosumerId)).Select(x => x.IpAddress).ToList();
            string ipBase = "192.168.0.";
            if (addresses.Count() == 0)
                return ipBase + "1";
            else
            {
                //nalazimo poslednju najvecu ip adresu i povecavamo je za 1
                int host = addresses.Select(ip => int.Parse(ip.Split('.').Last())).Max() + 1;
                return ipBase + host;
            }
        }

        public async Task<List<DeviceCategory>> GetCategories()
        {
            var categories = await _repository.GetCategories();
            if (categories == null) throw new ArgumentException("No categories!");
            return categories;
        }
        public async Task<List<DeviceType>> GetTypesByCategory(long categoryId)
        {
            var types = await _repository.GetTypesByCategory(categoryId);
            if (types == null) throw new ArgumentException("No types!");
            return types;
        }
        public async Task<List<DeviceInfo>> GetModels(long typeId)
        {
            var models = await _repository.GetModels(typeId);
            if (models == null) throw new ArgumentException("No models!");
            return models;
        }
    }
}
