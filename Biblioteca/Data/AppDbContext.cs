using Microsoft.EntityFrameworkCore;
using Biblioteca.Models;

namespace Biblioteca.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Livro> Livros { get; set; }
        public DbSet<Autor> Autor { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

    }
}