using API.Models.Paging;
using API.Models.Users;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IUserRepository : IProsumerRepository, IDsoRepository
    {
        public Task Save();
        public Task<List<Neigborhood>> GetNeigborhoods();
        public Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id);
        public Task SaveToken(User user, string token);
        public Task<Role> getRole(string naziv);
        public Task<string> getRoleName(long? id);

    }
}
