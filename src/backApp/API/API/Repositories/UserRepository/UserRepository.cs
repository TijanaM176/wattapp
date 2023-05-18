using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace API.Repositories.UserRepository
{
    public class UserRepository : IUserRepository
    {
        RegContext _context;
        private readonly IDsoRepository dsoRepository;
        private readonly IProsumerRepository prosumerRepository;

        public UserRepository(RegContext context, IProsumerRepository prosumerRepository, IDsoRepository dsoRepository)
        {
            _context = context;
            this.prosumerRepository = prosumerRepository;
            this.dsoRepository = dsoRepository;

        }

        public Task DeleteDsoWorker(string id)
        {
            return dsoRepository.DeleteDsoWorker(id);
        }

        public Task DeleteProsumer(string id)
        {
            return prosumerRepository.DeleteProsumer(id);
        }


        public Task<List<Dso>> GetAllDsos()
        {
            return dsoRepository.GetAllDsos();
        }

        public Task<List<Prosumer>> GetAllProsumers()
        {
            return prosumerRepository.GetAllProsumers();
        }

        public Task<Dso> GetDSO(string usernameOrEmail)
        {
            return dsoRepository.GetDSO(usernameOrEmail);
        }

        public Task<Dso> GetDSOWithToken(string token)
        {
            return dsoRepository.GetDSOWithToken(token);
        }

        public Task<Dso> GetDsoWorkerById(string id)
        {
            return dsoRepository.GetDsoWorkerById(id);
        }

        public Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters)
        {
            return dsoRepository.GetDsoWorkers(dsoWorkersParameters);
        }

        public Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            return prosumerRepository.GetProsumer(usernameOrEmail);
        }

        public Task<Prosumer> GetProsumerById(string id)
        {
            return prosumerRepository.GetProsumerById(id);
        }

        public Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters)
        {
            return prosumerRepository.GetProsumers(prosumerParameters);
        }

        public Task<Prosumer> GetProsumerWithToken(string token)
        {
            return prosumerRepository.GetProsumerWithToken(token);
        }

        public async Task<Role> getRole(string naziv)
        {
            return await _context.Roles.FirstOrDefaultAsync(x => x.RoleName.Equals(naziv));
        }

        public async Task<Region> getRegion(string naziv)
        {
            return await _context.Regions.FirstOrDefaultAsync(x => x.RegionName.Equals(naziv));
        }

        public async Task<City> getCity(string naziv)
        {
            return await _context.Cities.FirstOrDefaultAsync(x => x.Name.ToLower().Equals(naziv.ToLower()));
        }

        public async Task<Neigborhood> getNeigborhood(string naziv)
        {
            return await _context.Neigborhoods.FirstOrDefaultAsync(x => x.NeigbName.ToLower().Equals(naziv.ToLower()));
        }


        public async Task<string> getRoleName(long? id)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == id);
            return role.RoleName;
        }

        public Task InsertDSOWorker(Dso DSO_Worker)
        {
            return dsoRepository.InsertDSOWorker(DSO_Worker);
        }

        public Task InsertProsumer(Prosumer prosumer)
        {
            return prosumerRepository.InsertProsumer(prosumer);
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Neigborhood>> GetNeigborhoods()
        {
            return await _context.Neigborhoods.ToListAsync();
        }

        public async Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id)
        {
            var all = await _context.Prosumers.ToListAsync();
            List<Prosumer> prosumers = new List<Prosumer>();
            foreach (var item in all)
            {
                if (item.NeigborhoodId.Equals(id))
                {
                    prosumers.Add(item);
                }
            }

            return prosumers;
        }

        public async Task SaveToken(User user, string token)
        {
            user.Token = token;
            await _context.SaveChangesAsync();
        }

        public async Task SaveToken(User user, string token, DateTime expiry)
        {
            user.Token = token;
            user.TokenExpiry = expiry;
            await _context.SaveChangesAsync();
        }

        public IQueryable<Dso> FindAll()
        {
            return dsoRepository.FindAll();
        }

        IQueryable<Prosumer> IBaseRepository<Prosumer>.FindAll()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SetCoordinates(SaveCoordsDto saveCoords) // nebitnaFunkcija!
        {
            return await prosumerRepository.SetCoordinates(saveCoords);


        }
        public Task<Neigborhood> GetNeigborhoodsByID(string id)
        {
            return prosumerRepository.GetNeigborhoodsByID(id);
        }

        public Task<List<Neigborhood>> GetNeighborhoodByCityId(long CityId)
        {
            return prosumerRepository.GetNeighborhoodByCityId(CityId);
        }

        public Task<List<City>> GetCities()
        {
            return prosumerRepository.GetCities();
        }

        public Task<string> GetCityNameById(long id)
        {
            return prosumerRepository.GetCityNameById(id);
        }

        public Task<List<ProsumerLink>> AllLinks(string id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Dso>> GetDsoWorkersByRegionId(string RegionID)
        {
            return dsoRepository.GetDsoWorkersByRegionId(RegionID);
        }

        public Task<List<Dso>> GetWorkersbyRoleId(long RoleID)
        {
            return dsoRepository.GetWorkersbyRoleId(RoleID);
        }

        public Task<IEnumerable<Dso>> GetWorkerByFilter(string RegionID, long RoleID)
        {
            return dsoRepository.GetWorkerByFilter(RegionID, RoleID);
        }

        public async Task<List<long>> GetRoleIds()
        {
            return await _context.Roles.Select(x => x.Id).ToListAsync();
        }

        public async Task<List<string>> GetRegionIds()
        {
            return await _context.Regions.Select(x => x.Id).ToListAsync();
        }

        public Task<List<Role>> GetRoles()
        {
            return dsoRepository.GetRoles();
        }

        public Task<List<Region>> GetRegions()
        {
            return dsoRepository.GetRegions();
        }

        public async Task<string> GetRegionName(string id)
        {
            return (await _context.Regions.FirstOrDefaultAsync(x => x.Id == id)).RegionName;
        }

        public Task<string> GetNeighborhoodByName(string id)
        {
            return prosumerRepository.GetNeighborhoodByName(id);
        }

        public Task<Prosumer> UpdateProsumerByDso(ChangeProsumerbyDSO change)
        {
            return dsoRepository.UpdateProsumerByDso(change);
        }

        public Task<(String, Boolean)> SaveImageProsumer(String ProsumerId, string base64String)
        {
            return prosumerRepository.SaveImageProsumer(ProsumerId, base64String);
        }

        public Task<bool> DeleteImageProsumer(String ProsumerId)
        {
            return prosumerRepository.DeleteImageProsumer(ProsumerId);
        }

        public Task<List<ElectricityPrice>> Prices()
        {
            return dsoRepository.Prices();
        }

        public Task<double> GetPrice(DateTime date)
        {
            return dsoRepository.GetPrice(date);
        }

        public Task<bool> DeleteImageDso(string DsoWorkerId)
        {
            return dsoRepository.DeleteImageDso(DsoWorkerId);
        }

        public Task<(string, bool)> SaveImageDso(string DsoWorkerId, string base64StringFile)
        {
            return dsoRepository.SaveImageDso(DsoWorkerId, base64StringFile);
        }

        public Task<string> GetRoleName(long id)
        {
            return prosumerRepository.GetRoleName(id);
        }

        public bool HasProsumers(long cityId)
        {
            return prosumerRepository.HasProsumers(cityId);
        }

        public bool HasProsumers(string neighborhoodId)
        {
            return prosumerRepository.HasProsumers(neighborhoodId);
        }
    }
}
