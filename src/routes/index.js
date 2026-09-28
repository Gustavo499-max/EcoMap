const express = require("express");

const pontosRoutes = require("./pontosRoutes");
const materiaisRoutes = require("./materiaisRoutes");

const router = express.Router();

router.use("/pontos", pontosRoutes);
router.use("/materiais", materiaisRoutes);

module.exports = router;
