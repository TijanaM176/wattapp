using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models
{
    public class BookDetailContext : DbContext
    {
        public BookDetailContext(DbContextOptions<BookDetailContext> options) : base(options)
        {

        }

        public DbSet<BookDetail> BookDetails { get; set; }
    }
}
