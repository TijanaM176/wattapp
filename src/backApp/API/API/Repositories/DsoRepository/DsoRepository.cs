using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;

namespace API.Repositories.DsoRepository
{
    public class DsoRepository : BaseRepository<Dso>, IDsoRepository
    {
        RegContext _context;

        public DsoRepository(RegContext context) : base(context)
        {
            _context = context;
        }



        public async Task<List<Dso>> GetAllDsos()
        {
            return await _context.Dsos.ToListAsync();
        }



        public async Task<Dso> GetDSO(string usernameOrEmail)
        {
            return await _context.Dsos.FirstOrDefaultAsync(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }


        public async Task<Dso> GetDSOWithToken(string token)
        {
            return await _context.Dsos.FirstOrDefaultAsync(x => x.Token == token);
        }



        public async Task InsertDSOWorker(Dso DSO_Worker)
        {
            _context.Dsos.Add(DSO_Worker);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }


        public async Task<Dso> GetDsoWorkerById(string id)
        {
            return await _context.Dsos.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task DeleteDsoWorker(string id)
        {
            _context.Dsos.Remove(await GetDsoWorkerById(id));
            await _context.SaveChangesAsync();
        }

        public Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters) // promeniti ovo
        {
            return Task.FromResult(PagedList<Dso>.GetPagedList(FindAll().OrderBy(i => i.DateCreate), dsoWorkersParameters.PageNumber, dsoWorkersParameters.PageSize));
        }

        public async Task<List<Dso>> GetDsoWorkersByRegionId(string RegionID)
        {
            List<Dso> workers = await GetAllDsos();
            List<Dso> workersRegion = new List<Dso>();

            foreach (var worker in workers)
            {
                if (worker.RegionId.Equals(RegionID))
                    workersRegion.Add(worker);
            }
            return workersRegion;
        }
        public async Task<List<Dso>> GetWorkersbyRoleId(long RoleID)
        {
            List<Dso> workers = await GetAllDsos();
            List<Dso> workersRole = new List<Dso>();

            foreach (var worker in workers)
            {
                if (worker.RoleId == RoleID)
                    workersRole.Add(worker);
            }
            return workersRole;
        }

        public async Task<IEnumerable<Dso>> GetWorkerByFilter(string RegionID, long RoleID)
        {
            List<Dso> workersByRegion = await GetDsoWorkersByRegionId(RegionID);
            List<Dso> workersByRole = await GetWorkersbyRoleId(RoleID);

            //IEnumerable<Dso> workersFiler = workersByRegion.Intersect(workersByRole);


            return workersByRegion.Intersect(workersByRole);
        }

        public async Task<List<Role>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<List<Region>> GetRegions()
        {
            return await _context.Regions.ToListAsync();
        }

        public async Task<Prosumer> UpdateProsumerByDso(ChangeProsumerbyDSO change)
        {
            Prosumer prosumer = await _context.Prosumers.FirstOrDefaultAsync(x => x.Id == change.Id);

            if (prosumer != null) return prosumer;

            return null;
        }

        public async Task<List<ElectricityPrice>> Prices()
        {
            return await _context.ElectricityPrices.ToListAsync();
        }

        public async Task<double> GetPrice(DateTime date)
        {
            return (await _context.ElectricityPrices.FirstOrDefaultAsync(x => x.Timestamp.Date == date.Date)).Price;
        }

        public async Task<bool> DeleteImageDso(String DsoWorkerId)
        {
            var user = await _context.Dsos.FindAsync(DsoWorkerId);
            if (user == null || string.IsNullOrEmpty(user.Image))
                return false;
  
            user.Image = null;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(String, Boolean)> SaveImageDso(String DsoWorkerId, string base64String)
        {


                var user = await GetDsoWorkerById(DsoWorkerId);
                if (user == null)
                    return ("User not found!", false);


                user.Image = base64String;

                try
                {
                    await _context.SaveChangesAsync();
                    return (base64String, true);
                }
                catch (Exception)
                {
                    return ("Error saving image to database!", false);
                }
               
        }
    }
}
