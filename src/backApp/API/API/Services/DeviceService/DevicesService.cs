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


        /*
        public DevicesService(IOptions<DevicesSettings> devicesDbSettings)
        {
            var mongoClient = new MongoClient(devicesDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(devicesDbSettings.Value.DatabaseName);
            devicesCollection = mongoDatabase.GetCollection<Device>(devicesDbSettings.Value.CollectionName);
        }
        */


        public async Task<List<Timestamp>> proba()
        {
            return await _repository.GetTimestamps();
        }
    }
}
