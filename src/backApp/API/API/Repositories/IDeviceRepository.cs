using API.Models.Devices;

namespace API.Repositories
{
    public interface IDeviceRepository
    {
        public Task<string> GetDeviceName(string id);
        public Task<List<Device>> GetAllConsumersForProsumer(string id);
        public Task<List<Device>> GetAllProducersForProsumer(string id);
        public Task<List<Device>> GetAllStorageForProsumer(string id);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
        public Task<double> ConsumptionForLastWeekForProsumer(string id);
        public Task<double> ProductionForLastWeekForProsumer(string id);
    }
}
