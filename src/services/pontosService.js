const pontoModel = require("../models/pontoModel");

function listarPontos(filtros) {
  return pontoModel.listarTodos(filtros);
}

function buscarPonto(id) {
  return pontoModel.buscarPorId(id);
}

function criarPonto(dados) {
  return pontoModel.criar(dados);
}

function atualizarPonto(id, dados) {
  return pontoModel.atualizar(id, dados);
}

function excluirPonto(id) {
  return pontoModel.excluir(id);
}

module.exports = {
  listarPontos,
  buscarPonto,
  criarPonto,
  atualizarPonto,
  excluirPonto,
};
