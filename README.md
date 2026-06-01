# 📚 Biblioteca — Sistema de Gerenciamento

## 👥 Integrantes da Equipe

Isabella Aparecida de Matos
Guilherme Swiatyi dos Santos
Stephani aparecida Jung dias
João Henrique Ziegle do Rosário
Ângelo da Mata Panzera

## 📖 Descrição do Sistema

Sistema web para gerenciar uma biblioteca. Com ele é possível:

- Cadastrar, editar e remover **autores**
- Cadastrar, editar e remover **livros**
- **Filtrar** livros por gênero, autor ou pesquisar pelo título
- Ver um **resumo geral** com total de livros, autores e gêneros

O sistema é dividido em duas partes que rodam ao mesmo tempo:

| Parte | O que é | Endereço |
|-------|---------|----------|
| **Backend** | A API que salva e busca dados no banco | `http://localhost:5064` |
| **Frontend** | A tela visual que você abre no navegador | `http://localhost:5173` |

---

## 🛠️ Tecnologias Utilizadas

**Backend (pasta `Biblioteca/`)**
- **C# com ASP.NET Core** — linguagem e framework para criar a API
- **Entity Framework Core** — faz a comunicação com o banco de dados sem precisar escrever SQL
- **SQLite** — banco de dados local, salvo num arquivo chamado `app.db`
- **JWT (JSON Web Token)** — sistema de autenticação segura

**Frontend (pasta `react/`)**
- **React 19** — biblioteca para construir a interface visual
- **Vite** — ferramenta que roda o projeto React em modo de desenvolvimento
- **fetch** — função nativa do navegador usada para chamar a API

---

## ▶️ Como Rodar o Projeto

> Antes de tudo, você precisa ter instalado na sua máquina:
> - [.NET SDK 10](https://dotnet.microsoft.com/download) — para rodar o backend
> - [Node.js 22+](https://nodejs.org/) — para rodar o frontend

---

### 1. Rodar o Backend (API)

Abra um terminal, entre na pasta do backend e rode os comandos abaixo **na ordem**:

```bash
cd Biblioteca
```

```bash
dotnet restore
```
> Baixa todas as dependências do projeto C#

```bash
dotnet ef database update
```
> Cria o arquivo do banco de dados (`app.db`) com as tabelas prontas

```bash
dotnet run
```
> Inicia a API. Ela ficará disponível em `http://localhost:5064`

---

### 2. Rodar o Frontend (Tela Visual)

Abra **outro terminal** (deixe o backend rodando no primeiro), entre na pasta do frontend:

```bash
cd react
```

```bash
npm install
```
> Baixa todas as dependências do projeto React

```bash
npm run dev
```
> Inicia o servidor. Abra `http://localhost:5173` no navegador

---

### 3. Fazer Login

Na tela de login, use as credenciais:

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `admin123` |

---

## 🔗 Endpoints Principais

> Endpoints são os "endereços" da API que o frontend chama para buscar ou salvar dados.

### 🔐 Autenticação

| Método | Endereço | O que faz | Precisa de login? |
|--------|----------|-----------|-------------------|
| POST | `/api/auth/login` | Faz login e retorna o token | ❌ Não |

**Exemplo de envio:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Exemplo de resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📘 Livros

| Método | Endereço | O que faz | Precisa de login? |
|--------|----------|-----------|-------------------|
| GET | `/api/livros` | Lista todos os livros | ❌ Não |
| GET | `/api/livros/{id}` | Busca um livro pelo ID | ❌ Não |
| GET | `/api/livros/autor/{autorId}` | Lista livros de um autor | ❌ Não |
| GET | `/api/livros/genero/{genero}` | Lista livros por gênero | ❌ Não |
| POST | `/api/livros` | Cadastra um novo livro | ✅ Sim |
| PUT | `/api/livros/{id}` | Atualiza um livro | ✅ Sim |
| DELETE | `/api/livros/{id}` | Remove um livro | ✅ Sim |

**Exemplo de body para cadastrar livro:**
```json
{
  "titulo": "Duna",
  "ano": 1965,
  "genero": "FiccaoCientifica",
  "autorId": 1
}
```

---

### ✍️ Autores

| Método | Endereço | O que faz | Precisa de login? |
|--------|----------|-----------|-------------------|
| GET | `/api/autores` | Lista todos os autores | ❌ Não |
| GET | `/api/autores/{id}` | Busca um autor pelo ID | ❌ Não |
| POST | `/api/autores` | Cadastra um novo autor | ✅ Sim |
| PUT | `/api/autores/{id}` | Atualiza um autor | ✅ Sim |
| DELETE | `/api/autores/{id}` | Remove um autor | ✅ Sim |

**Exemplo de body para cadastrar autor:**
```json
{
  "nome": "Frank Herbert"
}
```

---

### 🏷️ Gêneros aceitos

O campo `genero` nos livros aceita exatamente um destes valores:

`Romance` · `Terror` · `Fantasia` · `FiccaoCientifica` · `Drama` · `Suspense` · `Misterio`

---

## 🔑 Autenticação JWT — Como Funciona

**JWT (JSON Web Token)** é uma forma segura de identificar quem está usando o sistema, sem precisar guardar sessão no servidor.

O fluxo é simples:

```
1. Você envia usuário e senha para /api/auth/login
        ↓
2. A API verifica as credenciais e devolve um token
        ↓
3. Você inclui esse token em toda requisição que precisa de login:
   Authorization: Bearer <token>
        ↓
4. A API lê o token, verifica se é válido e libera o acesso
```

**No projeto, está implementado assim:**

- `AuthController.cs` — recebe o login, verifica as credenciais e gera o token com validade de 2 horas
- `Program.cs` — configura a API para exigir o token nas rotas protegidas
- `appsettings.json` — guarda a chave secreta usada para assinar o token
- Rotas de **leitura (GET)** são públicas — qualquer um pode listar livros e autores
- Rotas de **escrita (POST, PUT, DELETE)** são protegidas — só funcionam com token válido
- No **frontend**, após o login o token é guardado no estado React e enviado automaticamente em todas as requisições de escrita

---

## 🗂️ Estrutura de Pastas

```
/
├── Biblioteca/                     ← Backend (API em C#)
│   ├── Controller/
│   │   ├── AuthController.cs       ← Login e geração do token JWT
│   │   ├── AutorController.cs      ← CRUD de autores
│   │   └── LivroController.cs      ← CRUD de livros
│   ├── Data/
│   │   └── AppDbContext.cs         ← Configuração do banco de dados
│   ├── Migrations/                 ← Histórico de criação das tabelas (gerado pelo EF)
│   ├── Model/
│   │   ├── Autor.cs                ← Estrutura da entidade Autor
│   │   ├── Livro.cs                ← Estrutura da entidade Livro
│   │   └── Genero.cs               ← Lista de gêneros disponíveis (enum)
│   ├── Repositories/
│   │   ├── IAutorRepository.cs     ← Interface: define o que o repositório de autores faz
│   │   ├── AutorRepository.cs      ← Implementação: como buscar/salvar autores no banco
│   │   ├── ILivroRepository.cs     ← Interface: define o que o repositório de livros faz
│   │   └── LivroRepository.cs      ← Implementação: como buscar/salvar livros no banco
│   ├── Program.cs                  ← Ponto de entrada da API; registra tudo
│   └── appsettings.json            ← Configurações gerais (banco, chave JWT)
│
└── react/                          ← Frontend (interface visual)
    └── src/
        ├── App.jsx                 ← Toda a lógica e componentes visuais da aplicação
        ├── main.jsx                ← Ponto de entrada do React
        └── index.css               ← Estilos visuais globais
```

---

## ⚠️ Observações

- O banco de dados SQLite é criado automaticamente na primeira vez que você rodar `dotnet run` — não precisa instalar nada extra.
- O arquivo do banco fica em `Biblioteca/app.db`. Se quiser resetar todos os dados, basta deletar esse arquivo e rodar `dotnet ef database update` novamente.
- O CORS está configurado para aceitar requisições apenas de `http://localhost:5173` — se mudar a porta do frontend, precisa atualizar o `Program.cs`.
- O **Repository Pattern** usado no projeto significa que os Controllers nunca acessam o banco diretamente — eles sempre passam pela interface do repositório. Isso deixa o código mais organizado e fácil de testar.