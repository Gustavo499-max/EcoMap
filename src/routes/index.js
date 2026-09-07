const express = require("express");

const pontosRoutes = require("./pontosRoutes");

const router = express.Router();

router.use("/pontos", pontosRoutes);

module.exports = router;
