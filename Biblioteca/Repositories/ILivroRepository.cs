using Biblioteca.Models;

namespace Biblioteca.Repositories
{
    public interface ILivroRepository
    {
        List<Livro> GetAll();
        Livro GetById(int id); 
        List<Livro> GetByAutor(int autorId);
        List<Livro> GetByGenero(Genero genero);
        void Add(Livro livro);
        void Update(Livro livro);
        void Delete(int id);
    }
}