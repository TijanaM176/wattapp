using API.Models.Paging;
using API.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IUserRepository : IBaseRepository<Prosumer>
    {
        public Task<Role> getRole(string naziv); 
        public Task<string> getRoleName(long? id);
        public Task<List<Prosumer>> GetAllProsumers();
        public Task<List<Dso>> GetAllDsos();
        public Task<Prosumer> GetProsumer(string usernameOrEmail);
        public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<Prosumer> GetProsumerWithToken(string token);
        public Task<Dso> GetDSOWithToken(string token);
        public Task<Prosumer> GetProsumerById(string id);
        Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters);
        public Task InsertProsumer(Prosumer prosumer);
        public Task InsertDSOWorker(Dso DSO_Worker);
        public Task SaveToken(User user, string token);
        public Task<Dso> GetDsoWorkerById(string id);
        public Task DeleteDsoWorker(string id);
        public Task DeleteProsumer(string id);
        public Task Save();
        public Task<List<Neigborhood>> GetNeigborhoods();
        public Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id);
    }
}
