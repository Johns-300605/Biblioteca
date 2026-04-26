using Biblioteca.Data;
using Biblioteca.Models;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Repositories
{
    public class LivroRepository : ILivroRepository
    {
        private readonly AppDbContext _context;

        public LivroRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Livro> GetAll()
        {
            return _context.Livros.ToList();
        }

        public Livro GetById(int id)
        {
            return _context.Livros.Find(id)!;
        }
        
        public List<Livro> GetByAutor(int autorId)
        {
            return _context.Livros
                .Where(l => l.AutorId == autorId)
                .ToList();
        }

        public List<Livro> GetByGenero(Genero genero)
        {
            return _context.Livros
                .Where(l => l.Genero == genero)
                .ToList();
        }

        public void Add(Livro livro)
        {
            if (livro.Ano > DateTime.Now.Year)
                throw new Exception("Ano não pode ser futuro");

            _context.Livros.Add(livro);
            _context.SaveChanges();
        }

        public void Update(Livro livro)
        {
            var existente = _context.Livros.Find(livro.Id);

            if (existente == null)
                return;

            existente.Titulo = livro.Titulo;
            existente.Ano = livro.Ano;
            existente.Genero = livro.Genero;
            existente.AutorId = livro.AutorId;

            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var livro = _context.Livros.Find(id);

            if (livro != null)
            {
                _context.Livros.Remove(livro);
                _context.SaveChanges();
            }
        }
    }
}