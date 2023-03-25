using API.Models.Devices;

namespace API.Services.Devices
{
    public interface IDevicesService
    {
        public Task<string> proba(string id);
        public Task<List<Device>> GetAllConsumersForProsumer(string id);
        public Task<List<Device>> GetAllProducersForProsumer(string id);
        public Task<List<Device>> GetAllStorageForProsumer(string id);
        public Task<double> CurrentConsumptionForProsumer(string id);
        public Task<double> CurrentProductionForProsumer(string id);
    }
}
