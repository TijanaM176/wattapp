using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;

namespace API.Repositories.DeviceRepository
{
    public interface IDeviceRepository
    {
        public Task<List<Device>> GetDevicesByCategory(string id, string catStr);
        public Task<List<Device>> GetDevicesByCategoryForAPeriod(string id, string catStr, int period);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
        public Task<double> ProductionForLastWeekForAllProsumers();
        public Task<double> ConsumptionForLastWeekForAllProsumers();
        public Task<List<ProsumerLink>> getAllProsumersWhoOwnDevice();
        public Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<Dictionary<string, object>> GetDevice(string id);
        public Task<double> MaxUsage(string id);
        public Task<DeviceInfo> GetDeviceInfoById(string id);
        public Task<Dictionary<DateTime, double>> ProductionConsumptionForLastWeekForDevice(string idDevice);
        public Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice);
        public Task<Prosumer> GetProsumer(string id);
        public Task<List<Prosumer>> GetProsumers();
        public Task<double> ProsumerDeviceCount(string id);
        public Task<DeviceInfo> EditDevice(string IdDevice, string DeviceName, string IpAddress);
        public Task<Boolean> DeleteDevice(string idDevice);
    }
}
