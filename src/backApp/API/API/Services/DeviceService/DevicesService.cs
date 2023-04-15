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

        public async Task<List<Dictionary<string, object>>> GetDevicesByCategory(string id, string catStr, string role)
        {
            var devices = await _repository.GetDevicesByCategory(id, catStr, role);
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
                { "Timestamps", d.Timestamps.Select(x => new { Date = x.Date, Power = x.Power, PredictedPower = x.PredictedPower}).FirstOrDefault() },
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

        public async Task<Dictionary<string,Dictionary<DateTime, double>>> ConsumptionProductionForAPeriodForProsumer(string id, int period, int type)    //0 cons, 1 prod
        {
            List<Device> devices;
            if (type == 0)
                devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Consumer", period);
            else
                devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Producer", period);

            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>();
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var dev in devices)
            {
                for (int i = 0; i < dev.Timestamps.Count; i++)
                {
                    var timestamp = dev.Timestamps[i];
                    if (data["timestamps"].ContainsKey(timestamp.Date)) {
                        data["timestamps"][timestamp.Date] += timestamp.Power;
                        data["predictions"][timestamp.Date] += timestamp.PredictedPower;
                    }
                    else
                    {
                        data["timestamps"].Add(timestamp.Date, timestamp.Power);
                        data["predictions"].Add(timestamp.Date, timestamp.PredictedPower);
                    }
                }
            }

            return data;
        }
        public async Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step)  //type 0 ako je consumption, 1 production
        {
            Dictionary<string, Dictionary<DateTime, double>> all = await ConsumptionProductionForAPeriodForProsumer(id, period, type);

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
            Dictionary<string, Dictionary<DateTime, double>> all = await ConsumptionProductionForAPeriodForProsumer(id, -30, type);

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
            Dictionary<string, Dictionary<DateTime, double>> all = await ConsumptionProductionForAPeriodForProsumer(id, -365, type);

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

        public async Task<DeviceInfo> GetDeviceInfoById(string id)
        {
            var deviceinfo = await _repository.GetDeviceInfoById(id);
            if (deviceinfo == null)
                throw new ArgumentException("No devices with that id!");
            return deviceinfo;
        }
        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ProductionConsumptionForLastWeekForDevice(string idDevice)
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
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await GroupedConProdForAPeriodForProsumer(prosumer, type, period, step);
                foreach (var cat in usagePerProsumer)
                {
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
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await LastMonthsGroupedConProdByWeekForProsumer(prosumer, type);
                
                foreach (var cat in usagePerProsumer)
                {
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
            data["timestamps"] = new Dictionary<DateTime, double>();
            data["predictions"] = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await LastYearsGroupedConProdByMonthForProsumer(prosumer, type);

                foreach (var cat in usagePerProsumer)
                {
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
                (double)x["consumption"] >= minConsumption/1000 && (double)x["consumption"] <= maxConsumption &&
                (double)x["production"] >= minProduction/1000 && (double)x["production"] <= maxProduction &&
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
                return ipBase + "10";
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

        public async Task<List<Dictionary<string, object>>> CurrentConsumptionAndProductionAllProsumers()
        {
            var prosumers = (await _repository.GetProsumers()).Select(x => new { Id = x.Id, Username = x.Username, FirstName = x.FirstName, LastName = x.LastName, Address = x.Address });
            var data = new List<Dictionary<string, object>>();

            foreach(var prosumer in prosumers)
            {
                Dictionary<string, object> prosumersExtended = new Dictionary<string, object>();
                prosumersExtended["Id"] = prosumer.Id;
                prosumersExtended["Username"] = prosumer.Username;
                prosumersExtended["FirstName"] = prosumer.FirstName;
                prosumersExtended["LastName"] = prosumer.LastName;
                prosumersExtended["Address"] = prosumer.Address;
                prosumersExtended["Consumption"] = await CurrentConsumptionForProsumer(prosumer.Id);
                prosumersExtended["Production"] = await CurrentProductionForProsumer(prosumer.Id);
                data.Add(prosumersExtended);
            }

            return data;
        }

        public async Task<List<Dictionary<string, object>>> Top5Consumers()
        {
            return (await CurrentConsumptionAndProductionAllProsumers()).OrderByDescending(x => x["Consumption"]).Take(5).ToList();
        }

        public async Task<List<Dictionary<string, object>>> Top5Producers()
        {
            return (await CurrentConsumptionAndProductionAllProsumers()).OrderByDescending(x => x["Production"]).Take(5).ToList();
        }

        public async Task<Dictionary<string, int>> ConsumerProducerRatio()
        {
            int producers = 0;
            int consumers = 0;
            int prosumers = 0;
            var all = (await _repository.GetProsumers()).Select(x => x.Id);

            foreach (var user in all)
            {
                var consumerCount = (await _repository.GetDevicesByCategory(user, "Consumer", "Prosumer")).Count();
                var producerCount = (await _repository.GetDevicesByCategory(user, "Producer", "Prosumer")).Count();

                if (consumerCount > 0 && producerCount > 0) prosumers++;
                else if (consumerCount > 0) consumers++;
                else if (producerCount > 0) producers++;
            }

            return new Dictionary<string, int> {
                { "consumers", consumers },
                { "producers", producers },
                { "prosumers", prosumers }
            };
        }

        public async Task<Dictionary<string, Dictionary<string, double>>> CityPercentages()
        {
            var prosumers = (await _repository.GetProsumers()).Select(x => new { Id = x.Id, CityId = x.CityId });
            Dictionary<string, Dictionary<string, double>> cities = new Dictionary<string, Dictionary<string, double>>();
            cities["Consumption"] = new Dictionary<string, double>();
            cities["Production"] = new Dictionary<string, double>();
            double totalConsumption = 0;
            double totalProduction = 0;

            foreach (var prosumer in prosumers)
            {
                var city = await _repository.GetCity(prosumer.CityId);
                var cons = await CurrentConsumptionForProsumer(prosumer.Id);
                var prod = await CurrentProductionForProsumer(prosumer.Id);

                if (cons > 0)
                {
                    totalConsumption += cons;

                    if (cities.ContainsKey(city))
                        cities["Consumption"][city] += cons;
                    else
                        cities["Consumption"][city] = cons;
                }
                
                if(prod > 0)
                {
                    totalProduction += prod;

                    if (cities.ContainsKey(city))
                        cities["Production"][city] += prod;
                    else
                        cities["Production"][city] = prod;
                }
            }

            foreach (var typepair in cities)
            {
                foreach (var pair in typepair.Value)
                {
                    if (typepair.Key == "Consumption") cities[typepair.Key][pair.Key] = Math.Round((pair.Value / totalConsumption) * 100, 2);
                    else cities[typepair.Key][pair.Key] = Math.Round((pair.Value / totalProduction) * 100, 2);
                }
            }

            return cities;
        }

        public async Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalProduction()
        {

            return await _repository.ThisWeekTotalProduction();
        }
        public async Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalConsumption()
        {

            return await _repository.ThisWeekTotalConsumption();
        }
        public async Task<double> NextWeekTotalPredictedProduction()
        {

            return await _repository.NextWeekTotalPredictedProduction();
        }
        public async Task<double> NextWeekTotalPredictedConsumption()
        {

            return await _repository.NextWeekTotalPredictedConsumption();
        }
    }
}
