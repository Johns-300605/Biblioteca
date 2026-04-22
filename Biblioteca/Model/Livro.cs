namespace Biblioteca.Models
{
    public class Livro
    {
        public int Id { get; set; }
        public string Titulo { get; set; }

        public int Ano { get; set; }

        public Genero Genero {get; set;}
        public int Autorid { get; set; }
    }
}