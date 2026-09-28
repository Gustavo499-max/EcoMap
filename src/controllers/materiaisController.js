const materiaisService = require("../services/materiaisService");

function listar(req, res, next) {
  try {
    const materiais = materiaisService.listarMateriais();

    return res.status(200).json({
      success: true,
      data: materiais,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
};
