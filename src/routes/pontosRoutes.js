const express = require("express");

const pontosController = require("../controllers/pontosController");

const {
  criarPontoValidation,
  idValidation,
  validarResultado,
} = require("../validators/pontoValidator");

const router = express.Router();

router.get("/", pontosController.listar);

router.get(
  "/:id",
  idValidation,
  validarResultado,
  pontosController.buscarPorId
);

router.post(
  "/",
  criarPontoValidation,
  validarResultado,
  pontosController.criar
);

router.put(
  "/:id",
  [...idValidation, ...criarPontoValidation],
  validarResultado,
  pontosController.atualizar
);

router.delete(
  "/:id",
  idValidation,
  validarResultado,
  pontosController.excluir
);

module.exports = router;
