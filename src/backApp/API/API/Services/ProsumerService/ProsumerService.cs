using API.Models.Paging;
using API.Models.Users;
using API.Repositories;

namespace API.Services.ProsumerService
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
        /*
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers != null) return prosumers;

            return null;
        }
        */
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers == null) throw new ArgumentException("No prosumers in database!");

            return prosumers;
        }

        public async Task<bool> DeleteProsumer(string id)
        {
            try
            {
                await _repository.DeleteProsumer(id);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> EditProsumer(string id, ProsumerEdit newValues)
        {
            Prosumer prosumer;
            try
            {
                prosumer = await GetProsumerById(id);
            }
            catch (Exception)
            {
                return false;       //ako ne moze da ga nadje, nije editovan
            }

            prosumer.FirstName = newValues.FirstName;
            prosumer.LastName = newValues.LastName;

            try
            {
                await _repository.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
