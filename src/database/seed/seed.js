const db = require("../connection");

const materiais = [
  {
    nome: "Papel",
    slug: "papel",
  },
  {
    nome: "Plástico",
    slug: "plastico",
  },
  {
    nome: "Vidro",
    slug: "vidro",
  },
  {
    nome: "Metal",
    slug: "metal",
  },
  {
    nome: "Eletrônicos",
    slug: "eletronicos",
  },
  {
    nome: "Óleo de cozinha",
    slug: "oleo-de-cozinha",
  },
  {
    nome: "Pilhas e baterias",
    slug: "pilhas-e-baterias",
  },
  {
    nome: "Roupas",
    slug: "roupas",
  },
];

const pontos = [
  {
    nome: "Ponto de Reciclagem Central",
    endereco: "Rua Principal",
    numero: "100",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000",
    telefone: "(11) 0000-0000",
    horario_funcionamento: "Segunda a sexta, 08:00 às 17:00",
    latitude: -23.5505,
    longitude: -46.6333,
    descricao: "Ponto fictício para testes do sistema EcoMap.",
    materiais: ["papel", "plastico", "vidro", "metal"],
  },
  {
    nome: "EcoRecicla",
    endereco: "Avenida Verde",
    numero: "250",
    bairro: "Jardim Verde",
    cidade: "Campinas",
    estado: "SP",
    cep: "13000-000",
    telefone: "(19) 0000-0000",
    horario_funcionamento: "Segunda a sábado, 09:00 às 18:00",
    latitude: -22.9099,
    longitude: -47.0626,
    descricao: "Ponto fictício para testes do sistema EcoMap.",
    materiais: ["plastico", "vidro", "eletronicos"],
  },
  {
    nome: "Recicla Mais",
    endereco: "Rua das Flores",
    numero: "75",
    bairro: "Centro",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "20000-000",
    telefone: "(21) 0000-0000",
    horario_funcionamento: "Segunda a sexta, 08:00 às 16:00",
    latitude: -22.9068,
    longitude: -43.1729,
    descricao: "Ponto fictício para testes do sistema EcoMap.",
    materiais: ["papel", "metal", "oleo-de-cozinha"],
  },
  {
    nome: "Cooperativa Verde",
    endereco: "Rua da Reciclagem",
    numero: "500",
    bairro: "Vila Nova",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30000-000",
    telefone: "(31) 0000-0000",
    horario_funcionamento: "Segunda a sexta, 08:00 às 17:00",
    latitude: -19.9167,
    longitude: -43.9345,
    descricao: "Ponto fictício para testes do sistema EcoMap.",
    materiais: ["papel", "plastico", "roupas", "pilhas-e-baterias"],
  },
];

const insertMaterial = db.prepare(`
  INSERT OR IGNORE INTO materiais (nome, slug)
  VALUES (?, ?)
`);

const insertPonto = db.prepare(`
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
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const findMaterial = db.prepare(`
  SELECT id
  FROM materiais
  WHERE slug = ?
`);

const insertPontoMaterial = db.prepare(`
  INSERT OR IGNORE INTO ponto_materiais (
    ponto_id,
    material_id
  )
  VALUES (?, ?)
`);

const seed = db.transaction(() => {
  for (const material of materiais) {
    insertMaterial.run(material.nome, material.slug);
  }

  const quantidadeAtual = db
    .prepare("SELECT COUNT(*) AS total FROM pontos_reciclagem")
    .get();

  if (quantidadeAtual.total > 0) {
    console.log("Os pontos já existem. Nenhum novo ponto foi inserido.");
    return;
  }

  for (const ponto of pontos) {
    const result = insertPonto.run(
      ponto.nome,
      ponto.endereco,
      ponto.numero,
      ponto.bairro,
      ponto.cidade,
      ponto.estado,
      ponto.cep,
      ponto.telefone,
      ponto.horario_funcionamento,
      ponto.latitude,
      ponto.longitude,
      ponto.descricao
    );

    for (const slug of ponto.materiais) {
      const material = findMaterial.get(slug);

      if (material) {
        insertPontoMaterial.run(result.lastInsertRowid, material.id);
      }
    }
  }
});

try {
  seed();

  console.log("Seed executado com sucesso.");
} catch (error) {
  console.error("Erro ao executar seed:", error);
  process.exit(1);
} finally {
  db.close();
}
