using API.Models.Paging;
using API.Models.Users;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.UserRepository
{
    public interface IUserRepository : IProsumerRepository, IDsoRepository
    {
        public Task Save();
        public Task<List<Neigborhood>> GetNeigborhoods();
        public Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id);
        public Task SaveToken(User user, string token);
        public Task SaveToken(User user, string token, DateTime expiry);
        public Task<Role> getRole(string naziv);
        public Task<string> getRoleName(long? id);
        public Task<Region> getRegion(string naziv);
        public Task<Neigborhood> getNeigborhood(string naziv);
        public Task<City> getCity(string naziv);
        public Task<List<long>> GetRoleIds();
        public Task<List<string>> GetRegionIds();
        public Task<string> GetRegionName(string id);
        public Task<string> GetRoleName(long id);

    }
}
