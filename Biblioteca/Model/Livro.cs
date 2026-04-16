namespace Biblioteca.Models
{
    public class Livro
    {
        public int Id { get; set; }
        public string Titulo { get; set; }

        public int Ano { get; set; }

        public Genero genero {get; set;}
        public Autor Autor { get; set; }

        public int AutorId {get; set;}
    }
}