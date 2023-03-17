using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IUserRepository
    {
        public Task<Role> getRole(string naziv); 
        public Task<string> getRoleName(long? id);
        public Task<List<Prosumer>> GetAllProsumers();
        public Task<List<Dso>> GetAllDsos();
        public Task<Prosumer> GetProsumer(string usernameOrEmail);
        public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<Prosumer> GetProsumerWithToken(string token);
        public Task<Dso> GetDSOWithToken(string token);
        public void InsertProsumer(Prosumer prosumer);
        public void InsertDSOWorker(Dso DSO_Worker);
        public void SaveToken(User user, string token);

        public Task<Prosumer> GetProsumerById(string id);
    }
}
