using Amazon.Runtime.Internal.Transform;
using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;
using API.Repositories.DeviceRepository;
using API.Repositories.UserRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Devices
{
    public class DevicesService : IDevicesService
    {
        private readonly IDeviceRepository _repository;
        private readonly IUserRepository _userRepository;
        public DevicesService(IDeviceRepository repository,IUserRepository dsoRepository)
        {
            _repository = repository;
            _userRepository = dsoRepository;
        }

        public async Task<List<Dictionary<string, object>>> GetDevicesByCategory(string id, string catStr, string role)
        {
            var devices = await _repository.GetDevicesByCategory(id, catStr, role);
            if (devices == null) throw new ArgumentException("No devices found!");

            var devicesData = devices.Select(d =>
            {
                var currentUsage = d.Timestamps.Select(async x =>
                {
                    if (d.Activity)
                    {
                        if (x.Power != 0) return x.Power;
                        else
                        {
                            Random rand = new Random();
                            return (double)(await _repository.GetDevice(d.Id))["AvgUsage"] * rand.Next(80, 110) / 100;
                        }
                    }
                    else
                    {
                        return 0;
                    }
                }).ToList();

                return new Dictionary<string, object> {
                    { "Id", d.Id  },
                    { "IpAddress", d.IpAddress },
                    { "Name", d.Name },
                    { "TypeId", d.TypeId},
                    { "CategoryId", d.CategoryId},
                    { "Manufacturer", d.Manufacturer},
                    { "Wattage", d.Wattage},
                    { "Activity", d.Activity },
                    { "DsoView", d.DsoView},
                    { "DsoControl", d.DsoControl },
                    { "CurrentUsage", currentUsage.FirstOrDefault().Result },
                };
            });
            return devicesData.ToList();
        }
        //moje
        /*public async Task<double> GetTotalConsumptionByCity(long idCity)
        {

            return await _repository.GetTotalConsumptionByCity(idCity);
        }
        public async Task<double> GetTotalProductionByCity(long idCity)
        {

            return await _repository.GetTotalProductionByCity(idCity);
        }*/
        //moje
        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            return await _repository.CurrentConsumptionForProsumer(id);
        }
        public async Task<double> CurrentProductionForProsumer(string id)
        {
            return await _repository.CurrentProductionForProsumer(id);
        }

        public async Task<double> CurrentConsumptionForProsumer(List<double> list)
        {
            double currentConsumption = 0;
            foreach (var value in list)
            {
                currentConsumption += value;
            }

            return currentConsumption;
        }
        public async Task<double> CurrentProductionForProsumer(List<double> list)
        {
            double currentProduction = 0;
            foreach (var value in list)
            {
                currentProduction += value;
            }

            return currentProduction;
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> ConsumptionProductionForAPeriodForProsumer(string id, int period, int type)    //0 cons, 1 prod
        {
            List<Device> devices;
            if (type == 0)
                devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Consumer", period);
            else
                devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Producer", period);

            var timestamps = new Dictionary<DateTime, (double Power, double PredictedPower)>();

            Parallel.ForEach(devices, device =>
            {
                foreach (var timestamp in device.Timestamps)
                {
                    var key = timestamp.Date;

                    lock (timestamps)
                    {
                        if (timestamps.TryGetValue(key, out var value))
                        {
                            timestamps[key] = (value.Power + timestamp.Power, value.PredictedPower + timestamp.PredictedPower);
                        }
                        else
                        {
                            timestamps.Add(key, (timestamp.Power, timestamp.PredictedPower));
                        }
                    }
                }
            });

            return new Dictionary<string, Dictionary<DateTime, double>>
            {
                ["timestamps"] = timestamps.ToDictionary(kv => kv.Key, kv => kv.Value.Power),
                ["predictions"] = timestamps.ToDictionary(kv => kv.Key, kv => kv.Value.PredictedPower)
            };
        }

        public async Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step)  //type 0 ako je consumption, 1 production
        {
            Dictionary<string, Dictionary<DateTime, double>> all = await ConsumptionProductionForAPeriodForProsumer(id, period, type);

            Dictionary<string, Dictionary<DateTime, double>> grouped = new Dictionary<string, Dictionary<DateTime, double>>
                {
                    ["timestamps"] = new Dictionary<DateTime, double>(),
                    ["predictions"] = new Dictionary<DateTime, double>()
                };

            var ts = all["timestamps"];
            foreach (KeyValuePair<DateTime, double> pair in ts)
            {
                DateTime intervalStart;
                if (step <= 24) intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                else //na mesec
                {
                    intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }

                if (grouped["timestamps"].ContainsKey(intervalStart))
                    grouped["timestamps"][intervalStart] += pair.Value;
                else
                    grouped["timestamps"].Add(intervalStart, pair.Value);
            }

            var pr = all["predictions"];
            foreach (KeyValuePair<DateTime, double> pair in pr)
            {
                DateTime intervalStart;
                if (step <= 24) intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                else //na mesec
                {
                    intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }

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
            Dictionary<string, Dictionary<DateTime, double>> data = new Dictionary<string, Dictionary<DateTime, double>>
                {
                    ["timestamps"] = new Dictionary<DateTime, double>(),
                    ["predictions"] = new Dictionary<DateTime, double>()
                };

            foreach (var prosumer in prosumers)
            {
                Dictionary<string, Dictionary<DateTime, double>> usagePerProsumer = await GroupedConProdForAPeriodForProsumer(prosumer, type, period, step);
                foreach (var cat in usagePerProsumer)
                {
                    foreach (var timestamp in cat.Value)
                    { 
                        if (data[cat.Key].ContainsKey(timestamp.Key))
                            data[cat.Key][timestamp.Key] += timestamp.Value;
                        else
                            data[cat.Key].Add(timestamp.Key, timestamp.Value);
                    }
                }

            }

            if (data == null) throw new ArgumentException("No timestamps!");
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

        public async Task<bool> EditDevice(string idDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl)
        {
            try
            {
                await _repository.EditDevice(idDevice, model, DeviceName, IpAddress, dsoView, dsoControl);
                return true;
            }
            catch 
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
            string ip = await GenerateIp(prosumerId);

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
        private async Task<bool> InsertLink(ProsumerLink link)
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

        private async Task<string> GenerateIp(string prosumerId)
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

        private async Task<List<Dictionary<string, object>>> CurrentConsumptionAndProductionAllProsumers()
        {
            var prosumers = (await _repository.GetProsumers()).Select(x => new { Id = x.Id, Username = x.Username, FirstName = x.FirstName, LastName = x.LastName, Address = x.Address });
            var data = new List<Dictionary<string, object>>();

            foreach(var prosumer in prosumers)
            {
                Dictionary<string, object> prosumersExtended = new Dictionary<string, object>
                {
                    ["Id"] = prosumer.Id,
                    ["Username"] = prosumer.Username,
                    ["FirstName"] = prosumer.FirstName,
                    ["LastName"] = prosumer.LastName,
                    ["Address"] = prosumer.Address,
                    ["Consumption"] = await CurrentConsumptionForProsumer(prosumer.Id),
                    ["Production"] = await CurrentProductionForProsumer(prosumer.Id)
                };
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
      
        public async Task<Dictionary<string, Dictionary<string, Dictionary<string, double>>>> CityPercentages()
        {
            var prosumers = (await _repository.GetProsumers()).Select(x => new { Id = x.Id, CityId = x.CityId });
            Dictionary<string, Dictionary<string, double>> cities = new Dictionary<string, Dictionary<string, double>>
                {
                    ["Consumption"] = new Dictionary<string, double>(),
                    ["Production"] = new Dictionary<string, double>()
                };
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

            Dictionary<string, Dictionary<string, double>> percentages = new Dictionary<string, Dictionary<string, double>>
                {
                    ["Consumption"] = new Dictionary<string, double>(),
                    ["Production"] = new Dictionary<string, double>()
                };

            Dictionary<string, Dictionary<string, double>> numbers = new Dictionary<string, Dictionary<string, double>>
                {
                    ["Consumption"] = new Dictionary<string, double>(),
                    ["Production"] = new Dictionary<string, double>()
                };

            foreach (var typepair in cities)
            {
                foreach (var pair in typepair.Value)
                {
                    if (typepair.Key == "Consumption")
                    {
                        numbers[typepair.Key].Add(pair.Key, pair.Value);
                        percentages[typepair.Key].Add(pair.Key, Math.Round((pair.Value / totalConsumption) * 100, 2));
                    }
                    else
                    {
                        numbers[typepair.Key].Add(pair.Key, pair.Value);
                        percentages[typepair.Key].Add(pair.Key, Math.Round((pair.Value / totalProduction) * 100, 2));
                    }
                }
            }

            return new Dictionary<string, Dictionary<string, Dictionary<string, double>>> { { "numbers", numbers }, { "percentages", percentages } };
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


        public async Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedTimestampsForDevice(string deviceId, int period, int step)
        {
            Dictionary<string, Dictionary<DateTime, double>> all = await _repository.ProductionConsumptionTimestampsForDevice(deviceId, period);

            Dictionary<string, Dictionary<DateTime, double>> grouped = new Dictionary<string, Dictionary<DateTime, double>>
                {
                    ["timestamps"] = new Dictionary<DateTime, double>(),
                    ["predictions"] = new Dictionary<DateTime, double>()
                };

            var ts = all["timestamps"];
            foreach (KeyValuePair<DateTime, double> pair in ts)
            {
                DateTime intervalStart = new DateTime();
                if (step <= 24) intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                else if (step <= 24*7)  //na po nedelju
                {
                    intervalStart = pair.Key.AddDays(-(int)pair.Key.DayOfWeek).Date;
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }
                else //na mesec
                {
                    intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }

                if (grouped["timestamps"].ContainsKey(intervalStart))
                    grouped["timestamps"][intervalStart] += pair.Value;
                else
                    grouped["timestamps"].Add(intervalStart, pair.Value);
            }

            var pr = all["predictions"];
            foreach (KeyValuePair<DateTime, double> pair in pr)
            {
                DateTime intervalStart = new DateTime();
                if (step <= 24) intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);
                else if (step <= 24 * 7)  //na po nedelju
                {
                    intervalStart = pair.Key.AddDays(-(int)pair.Key.DayOfWeek).Date;
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }
                else //na mesec
                {
                    intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, 1);
                    intervalStart = new DateTime(intervalStart.Year, intervalStart.Month, intervalStart.Day, 0, 0, 0);
                }

                if (step <= 24) intervalStart = new DateTime(pair.Key.Year, pair.Key.Month, pair.Key.Day, (pair.Key.Hour / step) * step, 0, 0);

                if (grouped["predictions"].ContainsKey(intervalStart))
                    grouped["predictions"][intervalStart] += pair.Value;
                else
                    grouped["predictions"].Add(intervalStart, pair.Value);
            }

            return grouped;
        }

        public async Task<(Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>)> PredictionForDevice(string idDevice)
        {
            var PredictionForDevices = await _repository.PredictionForDevice(idDevice);

            if (PredictionForDevices.Item1 == null && PredictionForDevices.Item2 == null && PredictionForDevices.Item3 == null)
            {
                throw new ArgumentException("No data for this device!");
            }

            var predictionsFor1Day = PredictionForDevices.Item1?.Count > 0 ? PredictionForDevices.Item1 : null;
            var predictionsFor3Day = PredictionForDevices.Item2?.Count > 0 ? PredictionForDevices.Item2 : null;
            var predictionsFor7Day = PredictionForDevices.Item3?.Count > 0 ? PredictionForDevices.Item3 : null;

            return (predictionsFor1Day, predictionsFor3Day, predictionsFor7Day);
        }
        public async Task<Tuple<double, double>> ThisMonthTotalConsumptionProductionForProsumer(string prosumerId)
        {
            var producers = await _repository.GetDevicesByCategoryForAPeriod(prosumerId, "Producer", -30);
            var consumers = await _repository.GetDevicesByCategoryForAPeriod(prosumerId, "Consumer", -30);
            double production = 0;
            double consumption = 0;

            foreach (var device in producers)
                foreach (var ts in device.Timestamps)
                    production += ts.Power;

            foreach (var device in consumers)
                foreach (var ts in device.Timestamps)
                    consumption += ts.Power;

            return new Tuple<double, double>(consumption, production);

        }

        public async Task<double> ToggleActivity(string deviceId, string role)
        {
            try
            {
                await _repository.ToggleActivity(deviceId, role);
                var dev = await _repository.GetDevice(deviceId);

                if ((bool)dev["Activity"])
                {
                    if ((double)dev["CurrentUsage"] == 0)
                    {
                        Random random = new Random();
                        return (double)dev["AvgUsage"] * random.Next(95, 105) / 100;
                    }
                    else return (double)dev["CurrentUsage"];
                }
                
                return 0;

            }catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
        public async Task<(double, double, string)> TodayAndYesterdayTotalConsumptionAndRatio()
        {

            return await _repository.TodayAndYesterdayTotalConsumptionAndRatio();
        }
        public async Task<(double, double, string)> TodayAndYesterdayTotalProductionAndRatio()
        {

            return await _repository.TodayAndYesterdayTotalProductionAndRatio();
        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalConsumptionAndRatio()
        {


            return await _repository.TodayAndTomorrowPredictionTotalConsumptionAndRatio();
        }
        public async Task<(double, double, string)> TodayAndTomorrowPredictionTotalProductionAndRatio()
        {

            return await _repository.TodayAndTomorrowPredictionTotalProductionAndRatio();
        }
    }
}
