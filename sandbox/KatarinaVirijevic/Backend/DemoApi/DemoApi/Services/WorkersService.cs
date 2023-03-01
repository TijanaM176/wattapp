using DemoApi.Data;
using DemoApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DemoApi.Services
{
    public class WorkersService
    {
        private readonly IMongoCollection<Worker> _workers;

        public WorkersService(IOptions<WorkersDatabaseSettings> options)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);
            _workers = mongoClient.GetDatabase(options.Value.DatabaseName).GetCollection<Worker>(options.Value.WorkersCollectionName);
        }

        public async Task<List<Worker>> Get() =>
            await _workers.Find(_ => true).ToListAsync();

        public async Task<Worker> Get(string id) =>
            await _workers.Find(w => w.Id == id).FirstOrDefaultAsync();

        public async Task Create(Worker newWorker) =>
            await _workers.InsertOneAsync(newWorker);

        public async Task Update(string id, Worker updateWorker) =>
            await _workers.ReplaceOneAsync(w => w.Id == id, updateWorker);

        public async Task Remove(string id) =>
            await _workers.DeleteOneAsync(w => w.Id == id);
    }
}
