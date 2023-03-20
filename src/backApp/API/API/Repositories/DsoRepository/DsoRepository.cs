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
    }


}
