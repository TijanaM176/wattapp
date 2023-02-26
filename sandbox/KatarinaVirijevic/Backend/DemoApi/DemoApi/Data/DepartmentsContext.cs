using Microsoft.EntityFrameworkCore;
using DemoApi.Models;

namespace DemoApi.Data
{
    public class DepartmentsContext : DbContext
    {
        public DepartmentsContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Department> Departments { get; set; }
    }
}
