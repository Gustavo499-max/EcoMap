const express = require("express");

const materiaisController = require("../controllers/materiaisController");

const router = express.Router();

router.get("/", materiaisController.listar);

module.exports = router;
