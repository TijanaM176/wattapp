using API.Models.Devices;

namespace API.Repositories
{
    public interface IDeviceRepository
    {
        public Task<List<Device>> GetDevicesByCategory(string id, string catStr);
        public Task<List<Device>> GetDevicesByCategoryForAPeriod(string id, string catStr, int period);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
        public Task<Dictionary<DateTime, double>> ConsumptionForAPeriodForProsumer(string id, int period);
        public Task<Dictionary<DateTime, double>> ProductionForAPeriodForProsumer(string id, int period);
        public Task<double> ConsumptionForLastWeekForProsumer(string id);
        public Task<double> ProductionForLastWeekForProsumer(string id);
        public Task<double> ProductionForLastWeekForAllProsumers();
        public Task<double> ConsumptionForLastWeekForAllProsumers();
        public Task<List<ProsumerLink>> getAllProsumersWhoOwnDevice();
    }
}
