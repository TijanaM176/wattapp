using API.Models.Users;

namespace API.Repositories.BaseHelpRepository
{
    public class BaseRepository<Something> : IBaseRepository<Something> where Something : class
    {

        RegContext _context { get; set; }
        public BaseRepository(RegContext context)
        {
            _context = context;
        }
        public IQueryable<Something> FindAll()
        {
            return _context.Set<Something>().AsNoTracking();
        }


    }
}
