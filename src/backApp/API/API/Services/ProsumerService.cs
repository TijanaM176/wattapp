using API.Models.Paging;
using API.Repositories;

namespace API.Services
{
    public class ProsumerService : IProsumerService
    {

        private readonly IUserRepository _repository;
        private readonly IConfiguration _config;
        public ProsumerService(IUserRepository repository, IConfiguration config)
        {
            _repository = repository;
            _config = config;
        }

        public Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters) // to su sa parametrima page i size 
        {
            return _repository.GetProsumers(prosumerParameters);
        }

        public async Task<Prosumer> GetProsumerById(string id)
        {
            var prosumer = await _repository.GetProsumerById(id);
            return prosumer;

        }
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers != null) return prosumers;

            return null;
        }

    }
}
