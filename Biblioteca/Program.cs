using Biblioteca.Data;
using Biblioteca.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ── Controllers + JSON ────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// ── Entity Framework / SQLite ─────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// ── Repositories (Repository Pattern) ────────────────────────────────────────
builder.Services.AddScoped<ILivroRepository, LivroRepository>();
builder.Services.AddScoped<IAutorRepository, AutorRepository>();

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey    = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtIssuer,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ─────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

// Garante que o banco existe (cria as tabelas se necessário)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

// Ordem importa: Authentication ANTES de Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
