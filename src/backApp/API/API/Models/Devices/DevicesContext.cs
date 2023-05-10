using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using static API.Models.Devices.DevicesContext;

namespace API.Models.Devices
{
    public class DevicesContext
    {
        private IMongoDatabase db { get; set; }
        private readonly IOptions<DevicesSettings> _config;
        public DevicesContext(IOptions<DevicesSettings> configuration)
        {
            var mongoClient = new MongoClient(configuration.Value.ConnectionString);
            db = mongoClient.GetDatabase(configuration.Value.DatabaseName);
            _config = configuration;
        }

        public IMongoCollection<DevicePower> PowerUsage
        {
            get
            {
                
                return db.GetCollection<DevicePower>(_config.Value.CollectionName);
            }
        }
    }
}
