using loginProbaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace loginProbaBackend.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
