using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;


public class CRUDDbContext:DbContext
{
    public CRUDDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }
}