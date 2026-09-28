// Listagem de pontos de reciclagem com filtros por cidade e material.
//
// Este script fica em arquivo externo porque o Helmet (src/app.js) aplica uma
// Content-Security-Policy que bloqueia scripts inline.
(() => {
  "use strict";

  const API_URL = "/api";

  const el = {
    formulario: document.getElementById("form-filtros"),
    cidade: document.getElementById("filtro-cidade"),
    material: document.getElementById("filtro-material"),
    limpar: document.getElementById("limpar-filtros"),
    resultados: document.getElementById("resultados"),
    resumo: document.getElementById("resumo"),
    carregando: document.getElementById("carregando"),
    vazio: document.getElementById("vazio"),
    vazioTexto: document.getElementById("vazio-texto"),
    erro: document.getElementById("erro"),
    tentarNovamente: document.getElementById("tentar-novamente"),
    lista: document.getElementById("lista-pontos"),
  };

  // Requisição em andamento. Cancelada quando o usuário filtra de novo,
  // evitando que uma resposta antiga sobrescreva a mais recente.
  let controlador = null;

  // As opções dos selects vêm da API; só ficam prontas após a 1ª carga.
  let opcoesCarregadas = false;

  const comparar = (a, b) => a.localeCompare(b, "pt-BR");

  // ---------- Acesso à API ----------

  async function consultar(caminho, params, signal) {
    const url = new URL(`${API_URL}${caminho}`, window.location.origin);

    for (const [chave, valor] of Object.entries(params || {})) {
      if (valor) {
        url.searchParams.set(chave, valor);
      }
    }

    const resposta = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });

    let corpo = null;

    try {
      corpo = await resposta.json();
    } catch (erro) {
      // Resposta que não é JSON é tratada como falha logo abaixo.
    }

    if (!resposta.ok || !corpo || !corpo.success || !Array.isArray(corpo.data)) {
      throw new Error(`Falha ao consultar ${caminho} (HTTP ${resposta.status}).`);
    }

    return corpo.data;
  }

  // ---------- Estados da tela ----------

  function mostrar(estado) {
    el.carregando.hidden = estado !== "carregando";
    el.vazio.hidden = estado !== "vazio";
    el.erro.hidden = estado !== "erro";
    el.lista.hidden = estado !== "lista";

    el.resultados.setAttribute("aria-busy", String(estado === "carregando"));

    if (estado !== "lista") {
      el.resumo.textContent = "";
    }
  }

  function filtrosSelecionados() {
    return {
      cidade: el.cidade.value,
      material: el.material.value,
    };
  }

  // ---------- Renderização ----------

  // `materiais` chega da API como texto separado por vírgula
  // (ex.: "Papel,Vidro"), mas aceita também uma lista.
  function normalizarMateriais(valor) {
    let nomes = [];

    if (Array.isArray(valor)) {
      nomes = valor.map((m) => (typeof m === "string" ? m : m && m.nome));
    } else if (typeof valor === "string") {
      nomes = valor.split(",");
    }

    return nomes
      .map((nome) => (nome || "").trim())
      .filter(Boolean)
      .sort(comparar);
  }

  function formatarEndereco(ponto) {
    const via = [ponto.endereco, ponto.numero].filter(Boolean).join(", ");
    const local = ponto.estado ? `${ponto.cidade}/${ponto.estado}` : ponto.cidade;

    return [via, ponto.bairro, local].filter(Boolean).join(" - ");
  }

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
      elemento.className = classe;
    }

    if (texto) {
      elemento.textContent = texto;
    }

    return elemento;
  }

  // Os dados da API são inseridos sempre via textContent (nunca innerHTML),
  // para que nomes ou endereços com HTML não sejam interpretados pelo navegador.
  function criarCartao(ponto) {
    const cartao = criarElemento("li", "ponto");

    cartao.append(
      criarElemento("h3", "", ponto.nome),
      criarElemento("p", "endereco", formatarEndereco(ponto))
    );

    if (ponto.horario_funcionamento) {
      cartao.append(
        criarElemento("p", "horario", `Horário: ${ponto.horario_funcionamento}`)
      );
    }

    const materiais = normalizarMateriais(ponto.materiais);

    if (materiais.length === 0) {
      cartao.append(criarElemento("p", "sem-materiais", "Materiais não informados."));
    } else {
      const chips = criarElemento("ul", "materiais");
      chips.setAttribute("aria-label", "Materiais aceitos");

      for (const nome of materiais) {
        chips.append(criarElemento("li", "", nome));
      }

      cartao.append(chips);
    }

    return cartao;
  }

  function renderizar(pontos) {
    const { cidade, material } = filtrosSelecionados();
    const temFiltro = Boolean(cidade || material);

    el.lista.replaceChildren();

    if (pontos.length === 0) {
      el.vazioTexto.textContent = temFiltro
        ? "Nenhum ponto de reciclagem encontrado para os filtros selecionados. Tente outra cidade ou outro material, ou limpe os filtros."
        : "Ainda não há pontos de reciclagem cadastrados.";

      mostrar("vazio");
      return;
    }

    el.lista.append(...pontos.map(criarCartao));

    el.resumo.textContent =
      pontos.length === 1 ? "1 ponto encontrado" : `${pontos.length} pontos encontrados`;

    mostrar("lista");
  }

  function preencherOpcoes(select, valores) {
    // Mantém a 1ª opção ("Todas..."), que representa "sem filtro".
    const padrao = select.options[0];

    select.replaceChildren(padrao);

    for (const { valor, rotulo } of valores) {
      const opcao = document.createElement("option");

      opcao.value = valor;
      opcao.textContent = rotulo;
      select.append(opcao);
    }
  }

  // ---------- Fluxos ----------

  // Substitui a requisição anterior (se houver) e devolve o sinal da nova.
  function iniciarRequisicao() {
    if (controlador) {
      controlador.abort();
    }

    controlador = new AbortController();

    return controlador.signal;
  }

  function tratarFalha(erro, signal) {
    // Requisição cancelada de propósito por uma consulta mais nova.
    if (signal.aborted) {
      return;
    }

    console.error(erro);
    mostrar("erro");
  }

  // Primeira carga: lista completa + opções dos filtros.
  // As cidades são extraídas dos próprios pontos cadastrados.
  async function iniciar() {
    const signal = iniciarRequisicao();

    mostrar("carregando");

    try {
      const [materiais, pontos] = await Promise.all([
        consultar("/materiais", {}, signal),
        consultar("/pontos", {}, signal),
      ]);

      const cidades = [...new Set(pontos.map((ponto) => ponto.cidade))].sort(comparar);

      preencherOpcoes(
        el.cidade,
        cidades.map((cidade) => ({ valor: cidade, rotulo: cidade }))
      );

      preencherOpcoes(
        el.material,
        materiais.map((m) => ({ valor: m.slug, rotulo: m.nome }))
      );

      opcoesCarregadas = true;
      renderizar(pontos);
    } catch (erro) {
      tratarFalha(erro, signal);
    }
  }

  async function filtrar() {
    const signal = iniciarRequisicao();

    mostrar("carregando");

    try {
      const pontos = await consultar("/pontos", filtrosSelecionados(), signal);

      renderizar(pontos);
    } catch (erro) {
      tratarFalha(erro, signal);
    }
  }

  // ---------- Eventos ----------

  // Se a 1ª carga falhou, refaz tudo; senão, apenas reaplica os filtros.
  function atualizar() {
    if (opcoesCarregadas) {
      filtrar();
    } else {
      iniciar();
    }
  }

  el.formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    atualizar();
  });

  el.limpar.addEventListener("click", () => {
    el.cidade.value = "";
    el.material.value = "";
    atualizar();
  });

  el.tentarNovamente.addEventListener("click", atualizar);

  iniciar();
})();
