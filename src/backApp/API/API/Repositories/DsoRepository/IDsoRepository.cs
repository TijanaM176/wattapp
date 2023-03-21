using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;

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
       
     
        Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters); // izmeni parametre
    }
}
