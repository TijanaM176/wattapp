using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;

namespace API.Repositories.DeviceRepository
{
    public interface IDeviceRepository
    {
        public Task<List<Device>> GetDevicesByCategory(string id, string catStr, string role);
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
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ProductionConsumptionTimestampsForDevice(string idDevice, int period);
        public Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice);
        public Task<Prosumer> GetProsumer(string id);
        public Task<List<Prosumer>> GetProsumers();
        public Task<double> ProsumerDeviceCount(string id);
        public Task EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl);
        public Task<Boolean> DeleteDevice(string idDevice);
        public Task InsertLink(ProsumerLink link);
        public Task<List<ProsumerLink>> GetLinksForProsumer(string id);
        public Task<List<DeviceCategory>> GetCategories();
        public Task<List<DeviceType>> GetTypesByCategory(long categoryId);
        public Task<List<DeviceInfo>> GetModels(long typeId);
        public Task<string> GetCity(long? id);
        public Task<List<Device>> GetDevicesByCategoryForThisPastFutureWeek(string id, string catStr, string answer);
        public Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalProduction();
        public Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalConsumption();
        public Task<double> NextWeekTotalPredictedProduction();
        public Task<double> NextWeekTotalPredictedConsumption();
        public Task<(Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>)> PredictionForDevice(string idDevice);
    }
}
