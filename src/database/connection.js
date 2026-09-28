const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const config = require("../config/env");
const { normalizarTexto } = require("../utils/texto");

const databaseDirectory = path.dirname(config.databasePath);

if (!fs.existsSync(databaseDirectory)) {
  fs.mkdirSync(databaseDirectory, {
    recursive: true,
  });
}

const db = new Database(config.databasePath);

db.pragma("foreign_keys = ON");

// O LOWER/LIKE do SQLite só ignora maiúsculas em ASCII e não trata acentos.
// Esta função permite buscas como "sao joao" encontrarem "São João".
db.function("normalizar", { deterministic: true }, normalizarTexto);

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);

module.exports = db;
