using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.DsoRepository
{
    public interface IDsoRepository : IBaseRepository<Dso>
    {
      
        public Task<List<Dso>> GetAllDsos();
        public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<Dso> GetDSOWithToken(string token);
        public Task InsertDSOWorker(Dso DSO_Worker);
        public Task<Dso> GetDsoWorkerById(string id);
        public Task DeleteDsoWorker(string id);
        public Task<List<Dso>> GetDsoWorkersByRegionId(string RegionID);
        public Task<List<Dso>> GetWorkersbyRoleId(long RoleID);
        public Task<IEnumerable<Dso>> GetWorkerByFilter(string RegionID, long RoleID);
        Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters); // izmeni parametre
        public Task<List<Role>> GetRoles();
        public Task<List<Region>> GetRegions();
        public Task<Prosumer> UpdateProsumerByDso(ChangeProsumerbyDSO change);
        public Task<List<ElectricityPrice>> Prices();
        public Task<double> GetPrice(DateTime date);
        public Task<bool> DeleteImageDso(String DsoWorkerId);
        public Task<(String, Boolean)> SaveImageDso(String DsoWorkerId, string base64String);
    }
}
