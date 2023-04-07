using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;

namespace API.Services.Devices
{
    public interface IDevicesService
    {
        public Task<List<Dictionary<string, object>>> GetDevicesByCategory(string id, string catStr);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConsumptionForAPeriodForProsumer(string id, int period);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ProductionForAPeriodForProsumer(string id, int period);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> LastMonthsGroupedConProdByWeekForProsumer(string id, int type);
        public Task<double> ConsumptionForLastWeekForAllProsumers();   
        public Task<double> ProductionForLastWeekForAllProsumers();
        public Task<List<Prosumer>> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<List<Prosumer>> ProsumerFilter2(string neighbourhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<Dictionary<string, object>> GetDevice(string id);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdForAPeriodTimestamps(int type, int period, int step);
        public Task<DeviceInfo> GetDeviceInfoById(string id);
        public Task<Dictionary<DateTime, double>> ProductionConsumptionForLastWeekForDevice(string idDevice);
        public Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdByWeekTimestamps(int type);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> LastYearsGroupedConProdByMonthForProsumer(string id, int type);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdByMonthTimestamps(int type);
        public Task<double> TotalCurrentConsumption();
        public Task<double> TotalCurrentProduction();
        public Task<Dictionary<string, object>> GetProsumerInformation(string id);
        public Task<List<Dictionary<string, object>>> AllProsumerInfo();
        public Task<List<Dictionary<string, object>>> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<List<Dictionary<string, object>>> UpdatedProsumerFilter2(string neighbourhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount);
        public Task<bool> EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl);
        public Task<Boolean> DeleteDevice(string idDevice);
        public Task<bool> RegisterDevice(string prosumerId, string modelId, string name, bool dsoView, bool dsoControl);
        public Task<List<DeviceCategory>> GetCategories();
        public Task<List<DeviceType>> GetTypesByCategory(long categoryId);
        public Task<List<DeviceInfo>> GetModels(long typeId);
    }
}
