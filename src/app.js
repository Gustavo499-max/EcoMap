const express = require("express");
const path = require("path");

const helmet = require("helmet");
const cors = require("cors");

const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const routes = require("./routes");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/index.html")
  );
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EcoMap API funcionando.",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada.",
  });
});

app.use(errorHandler);

module.exports = app;
