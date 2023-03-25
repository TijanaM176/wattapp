using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;

namespace API.Repositories.ProsumerRepository
{
    public class ProsumerRepository : BaseRepository<Prosumer>, IProsumerRepository
    {
        RegContext _context;

        public ProsumerRepository(RegContext context) : base(context)
        {
            _context = context;
        }

      

        
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            return await _context.Prosumers.ToListAsync();
        }


        public async Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }


        public async Task<Prosumer> GetProsumerWithToken(string token)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Token == token);
        }



        public async Task InsertProsumer(Prosumer prosumer)
        {
            _context.Prosumers.Add(prosumer);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }


        public async Task<Prosumer> GetProsumerById(string id)
        {


            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters)
        {
            return Task.FromResult(PagedList<Prosumer>.GetPagedList(FindAll().OrderBy(i => i.DateCreate), prosumerParameters.PageNumber, prosumerParameters.PageSize));
        }


        public async Task DeleteProsumer(string id)
        {
            _context.Prosumers.Remove(await GetProsumerById(id));
            await _context.SaveChangesAsync();
        }

        public async Task<List<ProsumerLink>> AllLinks(string id)
        {
            return await _context.ProsumerLinks.ToListAsync();
        }

    }


}
