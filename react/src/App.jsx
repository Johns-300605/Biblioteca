import { useState, useEffect } from "react";

const API = "http://localhost:5064";

const GENEROS = [
  "Todos",
  "Romance",
  "Terror",
  "Fantasia",
  "FiccaoCientifica",
  "Drama",
  "Suspense",
  "Misterio",
];

const GENERO_LABEL = {
  Romance:          "Romance",
  Terror:           "Terror",
  Fantasia:         "Fantasia",
  FiccaoCientifica: "Ficção Científica",
  Drama:            "Drama",
  Suspense:         "Suspense",
  Misterio:         "Mistério",
};

function badgeClass(genero) {
  return "badge badge-" + (genero || "").toLowerCase();
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── Tela de Login ────────────────────────────────────────────────────────────
function TelaLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro]         = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) { setErro("Usuário ou senha inválidos."); return; }

      const data = await res.json();
      onLogin(data.token);
    } catch {
      setErro("Não foi possível conectar à API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1>Biblioteca</h1>
        <p className="login-subtitle">Faça login para continuar</p>

        {erro && <div className="error-msg">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="login-hint">admin / admin123</p>
      </div>
    </div>
  );
}

// ─── Card de estatística ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, colorClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

// ─── Lista de Autores ─────────────────────────────────────────────────────────
function ListaAutores({ autores, onEditar, onDeletar, onAdicionar }) {
  const [nome, setNome]       = useState("");
  const [aberto, setAberto]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdicionar(nome.trim());
    setNome("");
    setAberto(false);
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Lista de Autores</h2>
        <button className="btn-primary" onClick={() => setAberto(!aberto)}>
          + Adicionar Autor
        </button>
      </div>

      {aberto && (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Nome do autor"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ flex: 1 }}
            autoFocus
          />
          <button type="submit" className="btn-primary">Salvar</button>
          <button type="button" onClick={() => setAberto(false)}>Cancelar</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(autores).map(([id, nome]) => (
            <tr key={id}>
              <td>{nome}</td>
              <td>
                <div className="actions">
                  <button className="btn-edit"   onClick={() => onEditar(id, nome)}   style={{ padding: "3px 10px" }}>Editar</button>
                  <button className="btn-danger"  onClick={() => onDeletar(id)}        style={{ padding: "3px 10px" }}>Deletar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Listagem de Livros ───────────────────────────────────────────────────────
function ListagemLivros({ livros, autores, onEditar, onDeletar }) {
  if (livros.length === 0) {
    return (
      <div className="section" style={{ textAlign: "center", color: "#6b6b6b", fontSize: 13 }}>
        Nenhum livro encontrado.
      </div>
    );
  }

  return (
    <div className="section">
      <h2 style={{ marginBottom: "1rem" }}>Todos os Livros</h2>
      <table>
        <thead>
          <tr>
            <th style={{ width: 44 }}></th>
            <th>Título</th>
            <th>Gênero</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((l) => (
            <tr key={l.id}>
              <td>
                <div className="book-id">{l.id}</div>
              </td>
              <td>
                <div className="book-info">
                  <strong>{l.titulo}</strong>
                  <span>{autores[l.autorId] || "Autor desconhecido"} ({l.ano})</span>
                </div>
              </td>
              <td>
                <span className={badgeClass(l.genero)}>
                  {GENERO_LABEL[l.genero] || l.genero}
                </span>
              </td>
              <td className="actions">
                <button className="btn-edit"   onClick={() => onEditar(l)}   style={{ padding: "3px 10px" }}>Editar</button>
                <button className="btn-danger" onClick={() => onDeletar(l.id)} style={{ padding: "3px 10px" }}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Painel inferior (gêneros + formulários) ──────────────────────────────────
function PainelInferior({ livros, autores, token, onLivroAdicionado, onAutorAdicionado }) {
  const [nomeAutor, setNomeAutor] = useState("");
  const [titulo,    setTitulo]    = useState("");
  const [autorId,   setAutorId]   = useState("");
  const [ano,       setAno]       = useState("");
  const [genero,    setGenero]    = useState("Terror");

  const quantidadePorGenero = GENEROS
    .filter((g) => g !== "Todos")
    .map((g) => ({
      genero: g,
      label: GENERO_LABEL[g] || g,
      quantidade: livros.filter((l) => l.genero?.toLowerCase() === g.toLowerCase()).length,
    }));

  async function handleAdicionarAutor(e) {
    e.preventDefault();
    if (!nomeAutor.trim()) return;
    await onAutorAdicionado(nomeAutor.trim());
    setNomeAutor("");
  }

  async function handleAdicionarLivro(e) {
    e.preventDefault();
    if (!titulo.trim() || !ano || !autorId) return alert("Preencha todos os campos!");
    await onLivroAdicionado({ titulo, autorId: Number(autorId), ano: Number(ano), genero });
    setTitulo("");
    setAno("");
    setAutorId("");
    setGenero("Terror");
  }

  return (
    <div className="bottom-grid">
      {/* Gêneros */}
      <div className="section">
        <h2 style={{ marginBottom: "0.75rem" }}>Quantidade por Gênero</h2>
        <ul className="genre-list">
          {quantidadePorGenero.map((item) => (
            <li key={item.genero}>
              <span>{item.label}</span>
              <span className="genre-count">{item.quantidade}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cadastrar Autor */}
      <div className="section">
        <h2 style={{ marginBottom: "0.75rem" }}>Cadastrar Novo Autor</h2>
        <form onSubmit={handleAdicionarAutor}>
          <div className="form-group">
            <label>Nome de Autor</label>
            <input
              type="text"
              placeholder="Nome do autor"
              value={nomeAutor}
              onChange={(e) => setNomeAutor(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 4 }}>
            Cadastrar Autor
          </button>
        </form>
      </div>

      {/* Adicionar Livro */}
      <div className="section">
        <h2 style={{ marginBottom: "0.75rem" }}>Adicionar Livro</h2>
        <form onSubmit={handleAdicionarLivro}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Autor</label>
            <select value={autorId} onChange={(e) => setAutorId(e.target.value)}>
              <option value="">Selecione…</option>
              {Object.entries(autores).map(([id, nome]) => (
                <option key={id} value={id}>{nome}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ano</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Gênero</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                {GENEROS.filter((g) => g !== "Todos").map((g) => (
                  <option key={g} value={g}>{GENERO_LABEL[g] || g}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 4 }}>
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
function App() {
  const [token,    setToken]    = useState(null);
  const [livros,   setLivros]   = useState([]);
  const [autores,  setAutores]  = useState({});
  const [filtroGenero, setFiltroGenero] = useState("Todos");
  const [filtroAutor, setFiltroAutor] = useState("Todos");
  const [pesquisa, setPesquisa] = useState("");

  async function buscarLivros() {
    try {
      const res  = await fetch(`${API}/api/livros`);
      const data = await res.json();
      setLivros(data);
    } catch (err) { console.error(err); }
  }

  async function buscarAutores() {
    try {
      const res  = await fetch(`${API}/api/autores`);
      const data = await res.json();
      const mapa = {};
      data.forEach((a) => { mapa[a.id] = a.nome; });
      setAutores(mapa);
    } catch (err) { console.error(err); }
  }

  useEffect(() => {
    if (!token) return;
    buscarLivros();
    buscarAutores();
  }, [token]);

  async function adicionarLivro(novoLivro) {
    await fetch(`${API}/api/livros`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(novoLivro),
    });
    buscarLivros();
  }

  async function adicionarAutor(nome) {
    const res = await fetch(`${API}/api/autores`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ nome }),
    });
    if (!res.ok) { alert("Erro ao cadastrar autor"); return; }
    const novo = await res.json();
    setAutores((prev) => ({ ...prev, [novo.id]: novo.nome }));
  }

  async function editarAutor(id, nomeAtual) {
    const novoNome = prompt("Editar autor:", nomeAtual);
    if (!novoNome) return;
    await fetch(`${API}/api/autores/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ id: Number(id), nome: novoNome }),
    });
    setAutores((prev) => ({ ...prev, [id]: novoNome }));
  }

  async function deletarAutor(id) {
    if (!window.confirm("Deseja deletar este autor?")) return;
    await fetch(`${API}/api/autores/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    setAutores((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  }

  async function deletarLivro(id) {
    await fetch(`${API}/api/livros/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    buscarLivros();
  }

  async function editarLivro(livro) {
    const novoTitulo = prompt("Novo título:", livro.titulo);
    if (!novoTitulo) return;

    const livroAtualizado = { ...livro, titulo: novoTitulo };

    const res = await fetch(`${API}/api/livros/${livro.id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(livroAtualizado),
    });

    if (res.ok) {
      buscarLivros();
    } else {
      alert("Erro ao editar livro.");
    }
  }

  // ── derivados ──
  const livrosFiltrados = livros.filter((l) => {
    const porGenero = filtroGenero === "Todos" || l.genero?.toLowerCase() === filtroGenero.toLowerCase();
    const porNome = l.titulo?.toLowerCase().includes(pesquisa.toLowerCase());
    const porAutor = filtroAutor === "Todos" || l.autorId.toString() === filtroAutor.toString();
    
    return porGenero && porNome && porAutor;
  });

  const totalGeneros = [...new Set(livros.map((l) => l.genero))].length;

  // ── render ──
  if (!token) return <TelaLogin onLogin={setToken} />;

  return (
    <div>
      <div className="page-header">
        <button className="btn-logout" onClick={() => setToken(null)}>
          Sair
        </button>
        <h1>Biblioteca</h1>
        <p>Visão geral do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="stat-grid">
        <StatCard icon="📚" label="Total de Livros"  value={livros.length}                    colorClass="purple" />
        <StatCard icon="👤" label="Total de Autores" value={Object.keys(autores).length}       colorClass="teal"   />
        <StatCard icon="🏷️" label="Gêneros"          value={totalGeneros}                     colorClass="coral"  />
      </div>

      {/* Autores */}
      <ListaAutores
        autores={autores}
        onEditar={editarAutor}
        onDeletar={deletarAutor}
        onAdicionar={adicionarAutor}
      />

      {/* Filtros */}
      <div className="section">
        <div className="filters">
          <div className="filter-group">
            <label>🔍 Pesquisar livro:</label>
            <input
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Digite o título..."
            />
          </div>
          <div className="filter-group">
            <label>Filtrar por gênero:</label>
            <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
              {GENEROS.map((g) => (
                <option key={g} value={g}>{GENERO_LABEL[g] || g}</option>
              ))}
            </select>
            <label>Filtrar por autor:</label>
            <select value={filtroAutor} onChange={(e) => setFiltroAutor(e.target.value)}>
              <option value="Todos">Todos</option>
              {Object.entries(autores).map(([id, nome]) => (
                <option key={id} value={id}>{nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gêneros + Formulários */}
      <PainelInferior
        livros={livros}
        autores={autores}
        token={token}
        onLivroAdicionado={adicionarLivro}
        onAutorAdicionado={adicionarAutor}
      />

      {/* Lista de livros */}
      <ListagemLivros
        livros={livrosFiltrados}
        autores={autores}
        onEditar={editarLivro}
        onDeletar={deletarLivro}
      />
    </div>
  );
}

export default App;
