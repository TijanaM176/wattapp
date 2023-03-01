using Microsoft.EntityFrameworkCore;
using Studenti.API.Models;

namespace Studenti.API.Data
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Student> dajSveStudente { get; set; }
    }
}
