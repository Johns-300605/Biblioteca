namespace Biblioteca.Models
{
    public class Livro
    {
        public int Id { get; set; }
        public required string Titulo { get; set; }

        public int Ano { get; set; }

        public Genero Genero {get; set;}
        public int AutorId { get; set; }
    }
}