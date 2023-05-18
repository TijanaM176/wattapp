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
        private readonly IUserRepository _dsoRepository;
        public DevicesService(IDeviceRepository repository,IUserRepository dsoRepository)
        {
            _repository = repository;
            _dsoRepository = dsoRepository;
        }

        public async Task<List<List<Dictionary<string, object>>>> GetDevices(string id)
        {
            var devices = await _repository.GetDevices(id);
            if (devices == null) throw new ArgumentException("No devices found!");
            List<List<Dictionary<string, object>>> devicesData = new List<List<Dictionary<string, object>>>();
            for (int i = 0; i < 3; i++)
            {
                devicesData.Add(devices[i].Select(d =>
                {
                    double currentUsage;
                    if (d.CategoryId == 3) currentUsage = d.Timestamps[0].Power;
                    else
                    { 
                        if (d.Activity > 0)
                        {
                            if (d.TypeId == 19 && (DateTime.Now.TimeOfDay < TimeSpan.FromHours(6) || DateTime.Now.TimeOfDay > TimeSpan.FromHours(18))) currentUsage = 0;
                            else
                            {
                                double avg = (_repository.AvgUsage(d.ModelId)).Result;
                                if (d.Timestamps[0].Power != 0) currentUsage = d.Timestamps[0].Power;
                                else currentUsage = avg * 0.85;
                            }
                        }
                        else currentUsage = 0;
                    }

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
                        { "CurrentUsage", Math.Round(currentUsage, 2) },
                    };
                }).ToList());
            }
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
        public async Task<Dictionary<string, double>> CurrentConsumptionAndProductionForProsumer(string id)
        {
            var devices = await GetDevices(id);
            if (devices.Count == 0) return new Dictionary<string, double> { { "consumption", 0 }, { "production", 0 } };

            var consumptionDevices = devices[0].Where(x => (int)x["Activity"] > 0);
            var productionDevices = devices[1].Where(x => (int)x["Activity"] > 0);

            double currentConsumption = consumptionDevices.Sum(device => (double)device["CurrentUsage"]);
            double currentProduction = productionDevices.Sum(device => (double)device["CurrentUsage"]);

            return new Dictionary<string, double> { { "consumption", currentConsumption }, { "production", currentProduction } };
        }
        public async Task<double> CurrentUsageForProsumer(List<double> list)
        {
            double currentUsage = 0;
            foreach (var value in list)
            {
                currentUsage += value;
            }

            return currentUsage;
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

            var data = new Dictionary<string, Dictionary<DateTime, double>>
            {
                ["timestamps"] = new Dictionary<DateTime, double>(),
                ["predictions"] = new Dictionary<DateTime, double>()
            };

            var usageTasks = prosumers.Select(async prosumer => await GroupedConProdForAPeriodForProsumer(prosumer, type, period, step));
            var usages = await Task.WhenAll(usageTasks);

            foreach (var usage in usages)
            {
                foreach (var cat in usage)
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

        public async Task<Dictionary<string, double>> TotalCurrentConsumptionAndProduction()
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            double consumption = 0;
            double production = 0;
            foreach (var prosumer in prosumers)
            {
                var usage = await CurrentConsumptionAndProductionForProsumer(prosumer);
                consumption += usage["consumption"];
                production += usage["production"];
            }
            return new Dictionary<string, double> { { "consumption", consumption }, { "production", production } };
        }

        public async Task<Dictionary<string, object>> GetProsumerInformation(string id)
        {
            var prosumer = await _repository.GetProsumer(id);
            var devices = await GetDevices(prosumer.Id);
            var cons = await CurrentUsageForProsumer(devices[0].Select(x => (double)x["CurrentUsage"]).ToList());
            var prod = await CurrentUsageForProsumer(devices[1].Select(x => (double)x["CurrentUsage"]).ToList());
            int devCount = await _repository.ProsumerDeviceCount(id);

            return new Dictionary<string, object> {
                { "id", id },
                { "firstname", prosumer.FirstName},
                { "lastname", prosumer.LastName},
                { "username", prosumer.Username },
                { "address", prosumer.Address },
                { "cityId", prosumer.CityId},
                { "neighborhoodId", prosumer.NeigborhoodId },
                { "lat", prosumer.Latitude },
                { "long", prosumer.Longitude },
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

        public async Task<List<Dictionary<string, object>>> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount,  string cityId, string neighborhoodId)
        {
            var list = (await AllProsumerInfo()).Where(x => 
                (double)x["consumption"] >= minConsumption/1000 && (double)x["consumption"] <= maxConsumption/1000 &&
                (double)x["production"] >= minProduction/1000 && (double)x["production"] <= maxProduction/1000 &&
                (int)x["devCount"] >= minDeviceCount && (int)x["devCount"] <= maxDeviceCount &&
                (cityId == "all" || (long)x["cityId"] == long.Parse(cityId)) &&
                (neighborhoodId == "all" || (string)x["neighborhoodId"] == neighborhoodId)
                ).ToList();

            return list;
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
                var usage = await CurrentConsumptionAndProductionForProsumer(prosumer.Id);
                Dictionary<string, object> prosumersExtended = new Dictionary<string, object>
                {
                    ["Id"] = prosumer.Id,
                    ["Username"] = prosumer.Username,
                    ["FirstName"] = prosumer.FirstName,
                    ["LastName"] = prosumer.LastName,
                    ["Address"] = prosumer.Address,
                    ["Consumption"] = usage["consumption"],
                    ["Production"] = usage["production"]
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
                var devices = await _repository.GetDevices(user);
                var consumerCount = devices[0].Count();
                var producerCount = devices[1].Count();

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
            var cityNames = (await _dsoRepository.GetCities()).Select(x => x.Name);
            cities["Consumption"] = cityNames.ToDictionary(cityName => cityName, _ => 0.0);
            cities["Production"] = cityNames.ToDictionary(cityName => cityName, _ => 0.0);

            foreach (var prosumer in prosumers)
            {
                var city = await _repository.GetCity(prosumer.CityId);
                var usage = await CurrentConsumptionAndProductionForProsumer(prosumer.Id);
                var cons = usage["consumption"];
                var prod = usage["production"];

                if (cons > 0)
                {
                    totalConsumption += cons;
                    cities["Consumption"][city] += cons;
                }

                if (prod > 0)
                {
                    totalProduction += prod;
                    cities["Production"][city] += prod;
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

            return new Dictionary<string, Dictionary<string, Dictionary<string, double>>>
            {
                {
                    "numbers",
                    numbers.ToDictionary(
                        pair => pair.Key,
                        pair => {
                            var sorted = pair.Value.OrderByDescending(x => x.Value);
                            var result = sorted.Take(5).ToDictionary(x => x.Key, x => x.Value);
                            var sumOfOthers = sorted.Skip(5).Sum(x => x.Value);
                            result.Add("Others", sumOfOthers);
                            return result;
                        }
                    )
                },
                {
                    "percentages",
                    percentages.ToDictionary(
                        pair => pair.Key,
                        pair => {
                            var sorted = pair.Value.OrderByDescending(x => x.Value);
                            var result = sorted.Take(5).ToDictionary(x => x.Key, x => x.Value);
                            var sumOfOthers = sorted.Skip(5).Sum(x => x.Value);
                            result.Add("Others", sumOfOthers);
                            return result;
                        }
                    )
                }
            };

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
            var producerTask = _repository.GetDevicesByCategoryForAPeriod(prosumerId, "Producer", -30);
            var consumerTask = _repository.GetDevicesByCategoryForAPeriod(prosumerId, "Consumer", -30);

            var producers = await producerTask;
            var consumers = await consumerTask;

            var production = producers.SelectMany(device => device.Timestamps).Sum(ts => ts.Power);
            var consumption = consumers.SelectMany(device => device.Timestamps).Sum(ts => ts.Power);

            return Tuple.Create(consumption, production);

        }

        public async Task<double> ToggleActivity(string deviceId, string role)
        {
            try
            {
                await _repository.ToggleActivity(deviceId, role);
                var dev = await _repository.GetDevice(deviceId);

                if ((int)dev["Activity"] > 0)
                {
                    if ((long)dev["TypeId"] == 19 && (DateTime.Now.TimeOfDay < TimeSpan.FromHours(6) || DateTime.Now.TimeOfDay > TimeSpan.FromHours(18))) return 0;
                    if ((double)dev["CurrentUsage"] == 0)  return Math.Round((double)dev["AvgUsage"] * 0.85, 2);                            
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

        public async Task<Dictionary<string, double>> ToggleStorageActivity(string deviceId, string role, int mode)
        {
            try
            {
                await _repository.ToggleStorageActivity(deviceId, role, mode);
                var dev = await _repository.GetDevice(deviceId);

                return new Dictionary<string, double>  {
                    { "Capacity", (double)dev["Wattage"]},
                    { "Status", (double)dev["CurrentUsage"]},
                    { "State", mode }
                } ;

            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Dictionary<string, double>> FilterRanges(string cityId, string neighborhoodId)
        {
            var prosumers = (await AllProsumerInfo()).Where(x =>
                (cityId == "all" || (long)x["cityId"] == long.Parse(cityId)) &&
                (neighborhoodId == "all" || (string)x["neighborhoodId"] == neighborhoodId)
            );

            return new Dictionary<string, double>  {
                { "minCons", (double)prosumers.Min(x => x["consumption"]) * 1000 },
                { "maxCons", (double)prosumers.Max(x => x["consumption"]) * 1000 },
                { "minProd", (double)prosumers.Min(x => x["production"]) * 1000 },
                { "maxProd", (double)prosumers.Max(x => x["production"]) * 1000 },
                { "minDevCount", (int)prosumers.Min(x => x["devCount"]) },
                { "maxDevCount", (int)prosumers.Max(x => x["devCount"]) }
            };
        }
    }
}
