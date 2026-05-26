# API Biblioteca

## Descrição

- Esse projeto é uma API de biblioteca feita em ASP.NET Core.
- Nele, é possível cadastrar autores e livros, listar, atualizar, deletar e também filtrar livros por gênero.
- Foi feita pensando em CRUD básico e algumas regras de negócio.

## Como rodar

- Primeiro restaura as dependências:
  dotnet restore
- Cria o banco:
  dotnet ef database update
- Roda a API:
  dotnet run
- Acessa no navegador ou Postman:
  http://localhost:5064

## Banco de dados

- O banco foi feito com Entity Framework Core (SQLite).
- Tem um script no arquivo "script.sql"
- Se não quiser usar o script, só rodar:
  dotnet ef database update

## Endpoints

### Livros
  GET /api/livros
    → retorna todos os livros
  
  - GET /api/livros/{id}
    → busca um livro pelo id
    → retorna 404 se não existir
  
  - GET /api/livros/genero/{genero}
    → filtra livros por gênero
      ex: /api/livros/genero/fantasia

  - GET /api/livros/autor/{autorId}
      → filtra livros por autor
  
  - POST /api/livros
    → cadastra um livro
    → retorna 409 se um livro de mesmo título já existir
  
  - PUT /api/livros/{id}
    → atualiza um livro
    → retorna 404 se o id não existir
  
  - DELETE /api/livros/{id}
    → remove um livro
    → retorna 404 se o id não existir

### Autores
  - GET /api/autores
    → lista todos os autores
  
  - GET /api/autores/{id}
    → busca autor por id
    → retorna 404 se não existir
  
  - POST /api/autores
    → cria um autor
    → retorna 409 se um autor de mesmo nome já existir
  
  - PUT /api/autores/{id}
    → atualiza autor
    → retorna 404 se não existir
  
  - DELETE /api/autores/{id}
    → remove autor
    →  retorna 404 se não existir
    
## Enum de gênero

- O campo genero é um enum e aceita os valores: Fantasia, Terror, Romance, Drama, FiccaoCientifica, Misterio

## Observações

- API testada com Postman
- Projeto organizado em Controller e Repository
- Uso de Entity Framework para acesso ao banco
