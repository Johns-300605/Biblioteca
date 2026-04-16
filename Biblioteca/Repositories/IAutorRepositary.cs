using Biblioteca.Models;

namespace Biblioteca.Repositories
{
    public interface IAutorRepository
    {
        List<Autor> GetAll();
        Autor GetById(int id);
        void Add(Autor autor);
        void Update(Autor autor);
        void Delete(int id);
    }
}