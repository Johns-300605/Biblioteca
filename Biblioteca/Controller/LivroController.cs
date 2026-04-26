using Microsoft.AspNetCore.Mvc;
using Biblioteca.Models;
using Biblioteca.Repositories;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/livros")]
    public class LivroController : ControllerBase
    {
        private readonly ILivroRepository _repo;

        public LivroController(ILivroRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_repo.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var livro = _repo.GetById(id);

            if (livro == null)
                return NotFound("Livro não encontrado");

            return Ok(livro);
        }
        
        [HttpGet("autor/{autorId}")]
        public IActionResult GetByAutor(int autorId)
        {
            var livros = _repo.GetByAutor(autorId);

            if (livros == null || !livros.Any())
                return NotFound("Nenhum livro encontrado para esse autor");

            return Ok(livros);
        }

        [HttpGet("genero/{genero}")]
        public IActionResult GetByGenero(Genero genero)
        {
            return Ok(_repo.GetByGenero(genero));
        }

        [HttpPost]
        public IActionResult Post(Livro livro)
        {
            try
            {
                var existente = _repo.GetAll()
                .FirstOrDefault(a => a.Titulo.ToLower().Trim() == livro.Titulo.ToLower().Trim());

                if (existente != null)
                return Conflict("Livro já cadastrado");

                _repo.Add(livro);
                return Ok(livro);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Livro livro)
        {
            var existente = _repo.GetById(id);

            if (existente == null)
            return NotFound("Livro não encontrado");

            livro.Id = id;
            _repo.Update(livro);

            return Ok("Livro atualizado com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var livro = _repo.GetById(id);

            if (livro == null)
            return NotFound("Livro não encontrado");

            _repo.Delete(id);
            return Ok("Livro removido com sucesso");
        }
    }
}