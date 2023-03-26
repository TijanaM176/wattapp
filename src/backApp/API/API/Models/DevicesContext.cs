﻿using API.Models.Devices;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using static API.Models.DevicesContext;

namespace API.Models
{
    public class DevicesContext
    {
        private IMongoDatabase db { get; set; }
        public DevicesContext(IOptions<DevicesSettings> configuration)
        {
            var mongoClient = new MongoClient(configuration.Value.ConnectionString);
            db = mongoClient.GetDatabase(configuration.Value.DatabaseName);
        }

        public IMongoCollection<Device> Consumers
        {
            get
            {
                return db.GetCollection<Device>("Consumers");
            }
        }

        public IMongoCollection<Device> Producers
        {
            get
            {
                return db.GetCollection<Device>("Producers");
            }
        }

        public IMongoCollection<Device> Storage
        {
            get
            {
                return db.GetCollection<Device>("Storage");
            }
        }
    }
}
