using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.ProsumerRepository
{
    public interface IProsumerRepository : IBaseRepository<Prosumer>
    {
    
        public Task<List<Prosumer>> GetAllProsumers();
        //public Task<List<Dso>> GetAllDsos();
        public Task<Prosumer> GetProsumer(string usernameOrEmail);
        //public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<Prosumer> GetProsumerWithToken(string token);
        //public Task<Dso> GetDSOWithToken(string token);
        public Task<Prosumer> GetProsumerById(string id);
        Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters);
        public Task InsertProsumer(Prosumer prosumer);
        //public Task InsertDSOWorker(Dso DSO_Worker);
       
        //public Task<Dso> GetDsoWorkerById(string id);
        //public Task DeleteDsoWorker(string id);
        public Task DeleteProsumer(string id);

        public Task<Boolean> SetCoordinates(SaveCoordsDto saveCoords);
        public Task<List<City>> GetCities();
        public Task<Neigborhood> GetNeigborhoodsByID(string id);
        public Task<List<Neigborhood>> GetNeighborhoodByCityId(long CityId);
        public Task<string> GetCityNameById(long id);
        public Task<List<ProsumerLink>> AllLinks(string id);
        public Task<string> GetNeighborhoodByName(string id);
        public Task<(String, Boolean)> SaveImageProsumer(String ProsumerId, string base64String);
        public Task<bool> DeleteImageProsumer(String ProsumerId);
        public Task<string> GetRoleName(long id);
        public bool HasProsumers(long cityId);
        public bool HasProsumers(string neighborhoodId);
    }
}
