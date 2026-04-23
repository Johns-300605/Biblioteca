using Microsoft.AspNetCore.Mvc;
using Biblioteca.Models;
using Biblioteca.Repositories;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/autores")]
    public class AutorController : ControllerBase
    {
        private readonly IAutorRepository _repo;

        public AutorController(IAutorRepository repo)
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
            var autor = _repo.GetById(id);

            if (autor == null)
                return NotFound("Autor não encontrado");

            return Ok(autor);
        }

        [HttpPost]
        public IActionResult Post(Autor autor)
        {
            try
            {
                var existente = _repo.GetAll()
                .FirstOrDefault(a => a.Nome.ToLower().Trim() == autor.Nome.ToLower().Trim());

                if (existente != null)
                return Conflict("Autor já cadastrado");

                _repo.Add(autor);
                return Ok(autor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Autor autor)
        {
            autor.Id = id;
            _repo.Update(autor);

            return Ok("Autor atualizado com sucesso");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repo.Delete(id);
            return Ok("Autor removido com sucesso");
        }
    }
}