using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Data
{
    public class GamesDbContext : DbContext
    {
        public GamesDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
    }
}
