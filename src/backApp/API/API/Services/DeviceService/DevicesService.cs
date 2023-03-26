using API.Models.Devices;
using API.Repositories;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace API.Services.Devices
{
    public class DevicesService : IDevicesService
    {
        private readonly IDeviceRepository _repository;

        public DevicesService(IDeviceRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> proba(string id)
        {
            return await _repository.GetDeviceName(id);
        }

        public async Task<List<Device>> GetAllConsumersForProsumer(string id)
        {
            var devices = await _repository.GetAllConsumersForProsumer(id);
            if (devices == null) throw new ArgumentException("No devices found!");
            return devices;
        }
        public async Task<List<Device>> GetAllProducersForProsumer(string id)
        {
            var devices = await _repository.GetAllProducersForProsumer(id);
            if (devices == null) throw new ArgumentException("No devices found!");
            return devices;
        }
        public async Task<List<Device>> GetAllStorageForProsumer(string id)
        {
            var devices = await _repository.GetAllStorageForProsumer(id);
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

        public async Task<double> ConsumptionForLastWeekForProsumer(string id)
        {
            return await _repository.ConsumptionForLastWeekForProsumer(id);
        }
        public async Task<double> ProductionForLastWeekForProsumer(string id)
        {
            return await _repository.ProductionForLastWeekForProsumer(id);
        }
    }
}
