const db = require("../database/connection");

// Campos que o validador aceita omitir. O better-sqlite3 exige todas as
// chaves dos parâmetros nomeados, então os ausentes viram NULL.
const CAMPOS_OPCIONAIS = [
  "numero",
  "bairro",
  "cep",
  "telefone",
  "horario_funcionamento",
  "latitude",
  "longitude",
  "descricao",
];

function normalizarDados(dados) {
  const normalizados = { ...dados };

  for (const campo of CAMPOS_OPCIONAIS) {
    if (normalizados[campo] === undefined || normalizados[campo] === "") {
      normalizados[campo] = null;
    }
  }

  return normalizados;
}

function listarTodos(filtros = {}) {
  let query = `
    SELECT DISTINCT
      p.*,
      GROUP_CONCAT(m.nome) AS materiais
    FROM pontos_reciclagem p
    LEFT JOIN ponto_materiais pm
      ON pm.ponto_id = p.id
    LEFT JOIN materiais m
      ON m.id = pm.material_id
  `;

  const conditions = [];
  const params = {};

  if (filtros.cidade) {
    conditions.push("LOWER(p.cidade) = LOWER(@cidade)");
    params.cidade = filtros.cidade;
  }

  if (filtros.material) {
    conditions.push(`
      EXISTS (
        SELECT 1
        FROM ponto_materiais pm2
        INNER JOIN materiais m2
          ON m2.id = pm2.material_id
        WHERE pm2.ponto_id = p.id
        AND m2.slug = @material
      )
    `);

    params.material = filtros.material;
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    GROUP BY p.id
    ORDER BY p.nome ASC
  `;

  const statement = db.prepare(query);

  return statement.all(params);
}

function listarMateriais() {
  const materiais = db
    .prepare(`
      SELECT
        id,
        nome,
        slug
      FROM materiais
    `)
    .all();

  // O SQLite ordena por byte, o que joga nomes acentuados
  // (ex.: "Óleo de cozinha") para o fim da lista.
  return materiais.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function buscarPorId(id) {
  const ponto = db
    .prepare(`
      SELECT *
      FROM pontos_reciclagem
      WHERE id = ?
    `)
    .get(id);

  if (!ponto) {
    return null;
  }

  const materiais = db
    .prepare(`
      SELECT
        m.id,
        m.nome,
        m.slug
      FROM materiais m
      INNER JOIN ponto_materiais pm
        ON pm.material_id = m.id
      WHERE pm.ponto_id = ?
      ORDER BY m.nome
    `)
    .all(id);

  return {
    ...ponto,
    materiais,
  };
}

function criar(dados) {
  const insert = db.prepare(`
    INSERT INTO pontos_reciclagem (
      nome,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      telefone,
      horario_funcionamento,
      latitude,
      longitude,
      descricao
    )
    VALUES (
      @nome,
      @endereco,
      @numero,
      @bairro,
      @cidade,
      @estado,
      @cep,
      @telefone,
      @horario_funcionamento,
      @latitude,
      @longitude,
      @descricao
    )
  `);

  const resultado = insert.run(normalizarDados(dados));

  associarMateriais(resultado.lastInsertRowid, dados.materiais || []);

  return buscarPorId(resultado.lastInsertRowid);
}

function atualizar(id, dados) {
  const update = db.prepare(`
    UPDATE pontos_reciclagem
    SET
      nome = @nome,
      endereco = @endereco,
      numero = @numero,
      bairro = @bairro,
      cidade = @cidade,
      estado = @estado,
      cep = @cep,
      telefone = @telefone,
      horario_funcionamento = @horario_funcionamento,
      latitude = @latitude,
      longitude = @longitude,
      descricao = @descricao,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);

  const resultado = update.run({
    ...normalizarDados(dados),
    id,
  });

  if (resultado.changes === 0) {
    return null;
  }

  db.prepare(`
    DELETE FROM ponto_materiais
    WHERE ponto_id = ?
  `).run(id);

  associarMateriais(id, dados.materiais || []);

  return buscarPorId(id);
}

function excluir(id) {
  const resultado = db
    .prepare(`
      DELETE FROM pontos_reciclagem
      WHERE id = ?
    `)
    .run(id);

  return resultado.changes > 0;
}

function associarMateriais(pontoId, materiais) {
  const buscarMaterial = db.prepare(`
    SELECT id
    FROM materiais
    WHERE slug = ?
  `);

  const inserirRelacionamento = db.prepare(`
    INSERT OR IGNORE INTO ponto_materiais (
      ponto_id,
      material_id
    )
    VALUES (?, ?)
  `);

  for (const slug of materiais) {
    const material = buscarMaterial.get(slug);

    if (material) {
      inserirRelacionamento.run(pontoId, material.id);
    }
  }
}

module.exports = {
  listarTodos,
  listarMateriais,
  buscarPorId,
  criar,
  atualizar,
  excluir,
};
