using API.Models.Devices;
using API.Models.HelpModels;
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
            var cons = await _repository.ConsumptionForAPeriodForProsumer(id, period);
            if (cons == null) throw new ArgumentException("No data!");
            return cons;
        }
        public async Task<Dictionary<DateTime, double>> ProductionForAPeriodForProsumer(string id, int period)
        {
            var prod = await _repository.ProductionForAPeriodForProsumer(id, period);
            if (prod == null) throw new ArgumentException("No data!");
            return prod;
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

        public async Task<Dictionary<DateTime, double>> ConsumptionForAPeriodTimestamps(int period)
        {
            var prosumers = (await _repository.getAllProsumersWhoOwnDevice()).Select(x => x.ProsumerId).Distinct();
            Dictionary<DateTime, double> timestamps = new Dictionary<DateTime, double>();

            foreach (var prosumer in prosumers)
            {
                var consumptionPerProsumer = await _repository.ConsumptionForAPeriodForProsumer(prosumer, period);

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
                var productionPerProsumer = await _repository.ProductionForAPeriodForProsumer(prosumer, period);

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
