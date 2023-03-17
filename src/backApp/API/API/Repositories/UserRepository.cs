using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository: IUserRepository
    {
        RegContext _context;
        public UserRepository(RegContext context) {
            _context = context;
        }

        public async Task<Role> getRole(string naziv)   //skracena
        {
            return await _context.Roles.FirstOrDefaultAsync(x => x.RoleName.Equals(naziv));
        }

        public async Task<string> getRoleName(long? id)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == id);
            return role.RoleName;
        }
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            return await _context.Prosumers.ToListAsync();
        }
        public async Task<List<Dso>> GetAllDsos()
        {
            return await _context.Dsos.ToListAsync();
        }

        public async Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }

        public async Task<Dso> GetDSO(string usernameOrEmail)
        {
            return await _context.Dsos.FirstOrDefaultAsync(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }
        public async Task<Prosumer> GetProsumerWithToken(string token)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Token == token);
        }

        public async Task<Dso> GetDSOWithToken(string token)
        {
            return await _context.Dsos.FirstOrDefaultAsync(x => x.Token == token);
        }

        public async void InsertProsumer(Prosumer prosumer)
        {
            _context.Prosumers.Add(prosumer);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }

        public async void InsertDSOWorker(Dso DSO_Worker)
        {
            _context.Dsos.Add(DSO_Worker);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }
        public async void SaveToken(User user, string token)
        {
            user.Token = token;
            await _context.SaveChangesAsync();
        }
    }
}
