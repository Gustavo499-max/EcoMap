const pontosService = require("../services/pontosService");

// Parâmetros repetidos (?cidade=a&cidade=b) chegam como array e
// quebrariam a consulta. Só texto é aceito; o resto é ignorado.
function textoOuUndefined(valor) {
  return typeof valor === "string" ? valor : undefined;
}

function listar(req, res, next) {
  try {
    const filtros = {
      cidade: textoOuUndefined(req.query.cidade),
      material: textoOuUndefined(req.query.material),
      busca: textoOuUndefined(req.query.busca),
    };

    const pontos = pontosService.listarPontos(filtros);

    return res.status(200).json({
      success: true,
      data: pontos,
    });
  } catch (error) {
    next(error);
  }
}

function buscarPorId(req, res, next) {
  try {
    const ponto = pontosService.buscarPonto(Number(req.params.id));

    if (!ponto) {
      return res.status(404).json({
        success: false,
        message: "Ponto de reciclagem não encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      data: ponto,
    });
  } catch (error) {
    next(error);
  }
}

function criar(req, res, next) {
  try {
    const ponto = pontosService.criarPonto(req.body);

    return res.status(201).json({
      success: true,
      message: "Ponto de reciclagem criado com sucesso.",
      data: ponto,
    });
  } catch (error) {
    next(error);
  }
}

function atualizar(req, res, next) {
  try {
    const ponto = pontosService.atualizarPonto(
      Number(req.params.id),
      req.body
    );

    if (!ponto) {
      return res.status(404).json({
        success: false,
        message: "Ponto de reciclagem não encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ponto atualizado com sucesso.",
      data: ponto,
    });
  } catch (error) {
    next(error);
  }
}

function excluir(req, res, next) {
  try {
    const excluido = pontosService.excluirPonto(
      Number(req.params.id)
    );

    if (!excluido) {
      return res.status(404).json({
        success: false,
        message: "Ponto de reciclagem não encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ponto excluído com sucesso.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
};
