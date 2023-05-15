using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;

namespace API.Services.Devices
{
    public interface IDevicesService
    {
        public Task<List<List<Dictionary<string, object>>>> GetDevices(string id);
        public Task<double> CurrentUsageForProsumer(List<double> list);
        public Task<Dictionary<string, double>> CurrentConsumptionAndProductionForProsumer(string id);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConsumptionProductionForAPeriodForProsumer(string id, int period, int type);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedConProdForAPeriodForProsumer(string id, int type, int period, int step);
        public Task<double> ConsumptionForLastWeekForAllProsumers();
        public Task<double> ProductionForLastWeekForAllProsumers();
        public Task<Dictionary<string, object>> GetDevice(string id);
        public Task<Dictionary<string, Dictionary<DateTime, double>>> ConProdForAPeriodTimestamps(int type, int period, int step);
        public Task<DeviceInfo> GetDeviceInfoById(string id);
        public Task<EnumCategory.DeviceCatergory> getDeviceCategoryEnum(string idDevice);
        public Task<Dictionary<string, double>> TotalCurrentConsumptionAndProduction();
        public Task<Dictionary<string, object>> GetProsumerInformation(string id);
        public Task<List<Dictionary<string, object>>> AllProsumerInfo();
        public Task<List<Dictionary<string, object>>> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount, string cityId, string neighborhoodId);
        public Task<bool> EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl);
        public Task<Boolean> DeleteDevice(string idDevice);
        public Task<bool> RegisterDevice(string prosumerId, string modelId, string name, bool dsoView, bool dsoControl);
        public Task<List<DeviceCategory>> GetCategories();
        public Task<List<DeviceType>> GetTypesByCategory(long categoryId);
        public Task<List<DeviceInfo>> GetModels(long typeId);
        public Task<List<Dictionary<string, object>>> Top5Consumers();
        public Task<List<Dictionary<string, object>>> Top5Producers();
        public Task<Dictionary<string, int>> ConsumerProducerRatio();
        public Task<Dictionary<string, Dictionary<string, Dictionary<string, double>>>> CityPercentages();
        public Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalProduction();
        public Task<(double, double, string, List<DateTime>, List<DateTime>)> ThisWeekTotalConsumption();
        public Task<double> NextWeekTotalPredictedProduction();
        public Task<double> NextWeekTotalPredictedConsumption();

        public Task<Dictionary<string, Dictionary<DateTime, double>>> GroupedTimestampsForDevice(string deviceId, int period, int step);

        public Task<(Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>, Dictionary<string, Dictionary<DateTime, double>>)> PredictionForDevice(string idDevice);
        public Task<Tuple<double, double>> ThisMonthTotalConsumptionProductionForProsumer(string prosumerId);
        public Task<double> ToggleActivity(string deviceId, string role);
        public Task<(double, double, string)> TodayAndYesterdayTotalConsumptionAndRatio();
        public Task<(double, double, string)> TodayAndYesterdayTotalProductionAndRatio();
        public Task<(double, double, string)> TodayAndTomorrowPredictionTotalConsumptionAndRatio();
        public Task<(double, double, string)> TodayAndTomorrowPredictionTotalProductionAndRatio();
        public Task<Dictionary<string, double>> ToggleStorageActivity(string deviceId, string role, int mode);
        public Task<Dictionary<string, double>> FilterRanges(string cityId, string neighborhoodId);
    }
}
