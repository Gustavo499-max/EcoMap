const pontoModel = require("../models/pontoModel");

function listarMateriais() {
  return pontoModel.listarMateriais();
}

module.exports = {
  listarMateriais,
};
