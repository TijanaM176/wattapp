using API.Models.Devices;
using API.Models.Users;
using API.Repositories.DeviceRepository;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Data;

namespace API.Services.Devices
{
    public class DevicesService: IDevicesService
    {
        private readonly IDeviceRepository _repository;

        public DevicesService(IDeviceRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Device>> GetDevicesByCategory(string id, string catStr)
        {
            var devices = await _repository.GetDevicesByCategory(id, catStr);
            if (devices == null) throw new ArgumentException("No devices found!");
            return devices;
        }

        public async Task<double> CurrentConsumptionForProsumer(string id)
        {
            return await _repository.CurrentConsumptionForProsumer(id);
        }

        public async Task<double> CurrentProductionForProsumer(string id)
        {
            return await _repository.CurrentProductionForProsumer(id);
        }

        public async Task<Dictionary<DateTime, double>> ConsumptionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Consumer", period);
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

        public async Task<Dictionary<DateTime, double>> GroupedConsumptionForAPeriodForProsumer(string id, int period)
        {
            var all = await ConsumptionForAPeriodForProsumer(id, period);
            Dictionary<DateTime, double> grouped = new Dictionary<DateTime, double>();
            foreach (var item in all)
            {
                var intervalStart = new DateTime(item.Key.Year, item.Key.Month, item.Key.Day, (item.Key.Hour / 12) * 12, 0, 0);
                if (grouped.ContainsKey(intervalStart))
                    grouped[intervalStart] += item.Value;
                else
                    grouped.Add(intervalStart, item.Value);
            }

            return grouped;
        }

        public async Task<Dictionary<DateTime, double>> ProductionForAPeriodForProsumer(string id, int period)
        {
            List<Device> devices = await _repository.GetDevicesByCategoryForAPeriod(id, "Producer", period);
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

        public async Task<Dictionary<DateTime, double>> GroupedProductionForAPeriodForProsumer(string id, int period)
        {
            var all = await ProductionForAPeriodForProsumer(id, period);
            Dictionary<DateTime, double> grouped = new Dictionary<DateTime, double>();
            foreach (var item in all)
            {
                var intervalStart = new DateTime(item.Key.Year, item.Key.Month, item.Key.Day, (item.Key.Hour / 12) * 12, 0, 0);
                if (grouped.ContainsKey(intervalStart))
                    grouped[intervalStart] += item.Value;
                else
                    grouped.Add(intervalStart, item.Value);
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

        public async Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            var prosumers = await _repository.ProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount);
            if (prosumers == null) throw new ArgumentException("No users fit that criteria!");
            return prosumers;
        }
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

        public async Task<Dictionary<string, object>> GetDevice(string id)
        {
            var device = await _repository.GetDevice(id);
            if (device == null) throw new ArgumentException("No device with that id!");
            return device;
        }

        public async Task<Dictionary<DateTime, double>> ConsumptionForAPeriodTimestamps(int period)
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<DateTime, double> timestamps = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                var consumptionPerProsumer = await ConsumptionForAPeriodForProsumer(prosumer, period);

                foreach (var timestamp in consumptionPerProsumer)
                {
                    var intervalStart = new DateTime(timestamp.Key.Year, timestamp.Key.Month, timestamp.Key.Day, (timestamp.Key.Hour / 12) * 12, 0, 0);
                    if (timestamps.ContainsKey(intervalStart))
                        timestamps[intervalStart] += timestamp.Value;
                    else
                        timestamps.Add(intervalStart, timestamp.Value);
                }
            }

            if (timestamps == null) throw new ArgumentException("No timestamps!");
            return timestamps;
        }

        public async Task<Dictionary<DateTime, double>> ProductionForAPeriodTimestamps(int period)
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<DateTime, double> timestamps = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                var productionPerProsumer = await ProductionForAPeriodForProsumer(prosumer, period);

                foreach (var timestamp in productionPerProsumer)
                {
                    var intervalStart = new DateTime(timestamp.Key.Year, timestamp.Key.Month, timestamp.Key.Day, (timestamp.Key.Hour / 12) * 12, 0, 0);
                    if (timestamps.ContainsKey(intervalStart))
                        timestamps[intervalStart] += timestamp.Value;
                    else
                        timestamps.Add(intervalStart, timestamp.Value);
                }
            }

            if (timestamps == null) throw new ArgumentException("No timestamps!");
            return timestamps;
        }
    }
}
