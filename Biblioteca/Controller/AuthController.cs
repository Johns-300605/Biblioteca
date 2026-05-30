using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        // POST /api/auth/login
        // Body: { "username": "admin", "password": "admin123" }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Usuário hardcoded para simplificar (sem banco de dados de usuários)
            if (request.Username != "admin" || request.Password != "admin123")
                return Unauthorized("Credenciais inválidas");

            var token = GerarToken(request.Username);

            return Ok(new { token });
        }

        private string GerarToken(string username)
        {
            var jwtKey    = _config["Jwt:Key"]!;
            var jwtIssuer = _config["Jwt:Issuer"]!;
            var key       = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds     = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer:             jwtIssuer,
                audience:           jwtIssuer,
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // DTO de entrada para o login
    public record LoginRequest(string Username, string Password);
}
