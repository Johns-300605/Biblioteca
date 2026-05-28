import { useState, useEffect } from "react";

const generos = [
  "Todos",
  "Romance",
  "Terror",
  "Fantasia",
  "FiccaoCientifica",
  "Drama",
  "Suspense",
  "Misterio",
];

const autoresIniciais = {
  1: "Rick Riordan",
  2: "Frank Herbert",
  3: "J.K. Rowling",
  4: "Machado de Assis",
  5: "Edgar Allan Poe",
  6: "Agatha Christie",
  7: "Stephen King",
  8: "Victor Hugo",
};

function ListagemLivros({
  livros,
  autoresLista,
  onDeletar,
}) {
  if (livros.length === 0) {
    return <p>Nenhum livro encontrado.</p>;
  }

  return (
    <div>
      <h2>
        Livros ({livros.length})
      </h2>

      {livros.map((l) => (
        <div key={l.id}>
          <strong>
            {l.titulo}
          </strong>

          {" — "}

          {l.genero}

          {" | "}

          {autoresLista[
            l.autorId
          ] || "Sem autor"}

          {" ("}
          {l.ano}
          {")"}

          <button
            onClick={() =>
              onDeletar(l.id)
            }
            style={{
              marginLeft: 10,
            }}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}

function FormularioAutor({
  onAdicionarAutor,
}) {
  const [nome, setNome] =
    useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome) {
      return alert(
        "Digite o nome do autor!"
      );
    }

    onAdicionarAutor(nome);

    setNome("");
  }

  return (
    <div>
      <h2>
        Cadastrar Autor
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
          </label>

          <input
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
          />
        </div>

        <button type="submit">
          Cadastrar Autor
        </button>
      </form>
    </div>
  );
}

function FormularioLivro({
  onAdicionar,
  autoresLista,
}) {
  const [titulo, setTitulo] =
    useState("");

  const [autorId, setAutorId] =
    useState(1);

  const [ano, setAno] =
    useState("");

  const [genero, setGenero] =
    useState("Terror");

  function handleSubmit(e) {
    e.preventDefault();

    if (!titulo || !ano) {
      return alert(
        "Preencha todos os campos!"
      );
    }

    onAdicionar({
      titulo,
      autorId: Number(
        autorId
      ),
      ano: Number(ano),
      genero,
    });

    setTitulo("");
    setAutorId(1);
    setAno("");
    setGenero("Terror");
  }

  return (
    <div>
      <h2>
        Adicionar Livro
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Título:
          </label>

          <input
            value={titulo}
            onChange={(e) =>
              setTitulo(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>
            Autor:
          </label>

          <select
            value={autorId}
            onChange={(e) =>
              setAutorId(
                e.target.value
              )
            }
          >
            {Object.entries(
              autoresLista
            ).map(
              ([id, nome]) => (
                <option
                  key={id}
                  value={id}
                >
                  {nome}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label>
            Ano:
          </label>

          <input
            type="number"
            value={ano}
            onChange={(e) =>
              setAno(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>
            Gênero:
          </label>

          <select
            value={genero}
            onChange={(e) =>
              setGenero(
                e.target.value
              )
            }
          >
            {generos
              .filter(
                (g) =>
                  g !== "Todos"
              )
              .map((g) => (
                <option
                  key={g}
                  value={g}
                >
                  {g}
                </option>
              ))}
          </select>
        </div>

        <button type="submit">
          Adicionar
        </button>
      </form>
    </div>
  );
}

function App() {
  const [livros, setLivros] =
    useState([]);

  const [
    autoresLista,
    setAutoresLista,
  ] = useState(
    autoresIniciais
  );

  const [
    filtroGenero,
    setFiltroGenero,
  ] = useState("Todos");

  const [pesquisa, setPesquisa] =
    useState("");

  async function buscarLivros() {
    try {
      const response =
        await fetch(
          "http://localhost:5064/api/livros"
        );

      const data =
        await response.json();

      console.log(data);

      setLivros(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    buscarLivros();

    console.log(
      autoresLista
    );
  }, []);

  async function adicionarLivro(
    novoLivro
  ) {
    await fetch(
      "http://localhost:5064/api/livros",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          novoLivro
        ),
      }
    );

    buscarLivros();
  }

  async function adicionarAutor(
    nome
  ) {
    try {
      const response =
        await fetch(
          "http://localhost:5064/api/autores",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              nome,
            }),
          }
        );

      if (!response.ok) {
        alert(
          "Erro ao cadastrar autor"
        );
        return;
      }

      const novoAutor =
        await response.json();

      console.log(
        novoAutor
      );

      setAutoresLista(
        (prev) => ({
          ...prev,
          [novoAutor.id]:
            novoAutor.nome,
        })
      );

    } catch (error) {
      console.log(error);
    }
  }

  async function editarAutor(
    id,
    nomeAtual
  ) {
    const novoNome =
      prompt(
        "Editar autor:",
        nomeAtual
      );

    if (!novoNome) return;

    try {
      await fetch(
        `http://localhost:5064/api/autores/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: Number(id),
            nome: novoNome,
          }),
        }
      );

      setAutoresLista({
        ...autoresLista,
        [id]: novoNome,
      });

    } catch (error) {
      console.log(error);
    }
  }

  async function deletarAutor(
    id
  ) {
    const confirmar =
      window.confirm(
        "Deseja deletar este autor?"
      );

    if (!confirmar) return;

    try {
      await fetch(
        `http://localhost:5064/api/autores/${id}`,
        {
          method: "DELETE",
        }
      );

      const novosAutores = {
        ...autoresLista,
      };

      delete novosAutores[id];

      setAutoresLista(
        novosAutores
      );

    } catch (error) {
      console.log(error);
    }
  }

  async function deletarLivro(
    id
  ) {
    await fetch(
      `http://localhost:5064/api/livros/${id}`,
      {
        method: "DELETE",
      }
    );

    buscarLivros();
  }

  const livrosFiltrados =
    livros.filter((l) => {
      const generoValido =
        filtroGenero === "Todos" ||
        l.genero?.toLowerCase() ===
          filtroGenero.toLowerCase();

      const nomeValido =
        l.titulo
          ?.toLowerCase()
          .includes(
            pesquisa.toLowerCase()
          );

      return (
        generoValido &&
        nomeValido
      );
    });

  const quantidadePorGenero =
    generos
      .filter(
        (g) =>
          g !== "Todos"
      )
      .map((g) => ({
        genero: g,
        quantidade:
          livros.filter(
            (l) =>
              l.genero?.toLowerCase() ===
              g.toLowerCase()
          ).length,
      }));

  const totalLivros =
    livros.length;

  const totalGeneros = [
    ...new Set(
      livros.map((l) =>
        l.genero
      )
    ),
  ].length;







  return (
    <div>
      <h1>Biblioteca</h1>

  

      <h2>Resumo do Sistema</h2>

      <div>
        Total de livros: {" "}
        {totalLivros}
      </div>

      <div>
        Total de gêneros: {" "}
        {totalGeneros}
      </div>

      <div>
        Total de autores: {" "}
        {
          Object.keys(autoresLista).length
        }
      </div>

      <h3>Autores</h3>

      <ul>
        {Object.entries(autoresLista).map(
          ([id, autor]) => (
            <li key={id}>
              {autor}

              <button
                onClick={() =>
                  editarAutor(id, autor)
                }
                style={{
                  marginLeft: 10,
                }}
              >
                Editar
              </button>

              <button
                onClick={() =>
                  deletarAutor(id)
                }
                style={{
                  marginLeft: 5,
                }}
              >
                Deletar
              </button>
            </li>
          )
        )}
      </ul>


      <div>
        <label>
          Pesquisar livro:
        </label>

        <input
          type="text"
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(e.target.value)
          }
          placeholder="Digite o nome do livro"
        />
      </div>

      <div>
        <label>
          Filtrar por gênero:
        </label>

        <select
          value={filtroGenero}
          onChange={(e) =>
            setFiltroGenero(e.target.value)
          }
        >
          {generos.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>



      <h2>
        Quantidade de livros por gênero
      </h2>

      {quantidadePorGenero.map((item) => (
        <div key={item.genero}>
          {item.genero}: {" "}
          {item.quantidade}
        </div>
      ))}



      <ListagemLivros
        livros={livrosFiltrados}
        autoresLista={autoresLista}
        onDeletar={deletarLivro}
      />


      <FormularioLivro
        onAdicionar={adicionarLivro}
        autoresLista={autoresLista}
      />


      <FormularioAutor
        onAdicionarAutor={adicionarAutor}
      />
    </div>
  );
}

export default App;