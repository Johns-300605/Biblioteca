using Biblioteca.Data;
using Biblioteca.Models;

namespace Biblioteca.Repositories
{
    public class AutorRepository : IAutorRepository
    {
        private readonly AppDbContext _context;

        public AutorRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Autor> GetAll()
        {
            return _context.Autor.ToList();
        }

        public Autor GetById(int id)
        {
            return _context.Autor.Find(id);
        }

        public void Add(Autor autor)
        {
            _context.Autor.Add(autor);
            _context.SaveChanges();
        }

        public void Update(Autor autor)
        {
            var existente = _context.Autor.Find(autor.Id);

            if (existente == null)
                return;

            existente.Nome = autor.Nome;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var autor = _context.Autor.Find(id);

            if (autor != null)
            {
                _context.Autor.Remove(autor);
                _context.SaveChanges();
            }
        }
    }
}