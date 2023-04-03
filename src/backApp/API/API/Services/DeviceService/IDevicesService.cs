using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;

namespace API.Services.Devices
{
    public interface IDevicesService
    {
        public Task<List<Device>> GetDevicesByCategory(string id, string catStr);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
        public Task<Dictionary<DateTime, double>> ConsumptionForAPeriodForProsumer(string id, int period);
        public Task<Dictionary<DateTime, double>> ProductionForAPeriodForProsumer(string id, int period);
        public Task<Dictionary<DateTime, double>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step);
        public Task<Dictionary<DateTime, double>> LastMonthsGroupedConProdByWeekForProsumer(string id, int type);
        public Task<double> ConsumptionForLastWeekForAllProsumers();   
        public Task<double> ProductionForLastWeekForAllProsumers();
        public Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<List<Prosumer>> ProsumerFilter2(string neighbourhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<Dictionary<string, object>> GetDevice(string id);
        public Task<Dictionary<DateTime, double>> ConProdForAPeriodTimestamps(int type, int period, int step);
        public Task<DeviceInfo> GetDeviceInfoById(string id);
        public Task<Dictionary<DateTime, double>> ProductionConsumptionForLastWeekForDevice(string idDevice);
        public Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice);
        public Task<Dictionary<DateTime, double>> ConProdByWeekTimestamps(int type);
        public Task<Dictionary<DateTime, double>> LastYearsGroupedConProdByMonthForProsumer(string id, int type);
        public Task<Dictionary<DateTime, double>> ConProdByMonthTimestamps(int type);
    }
}
