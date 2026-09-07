const app = require("./app");
const config = require("./config/env");

// Importar a conexão garante que o banco
// e o schema sejam inicializados.
require("./database/connection");

app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════╗
║             EcoMap                 ║
║     Sistema de Reciclagem         ║
╚════════════════════════════════════╝

Servidor: http://localhost:${config.port}
Ambiente: ${config.nodeEnv}
  `);
});
