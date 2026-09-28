// "  São JOÃO " -> "sao joao". Usado para comparar textos sem
// diferenciar maiúsculas de minúsculas nem acentos.
function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Escapa os curingas do LIKE (% e _) e a própria barra invertida,
// para que o texto digitado pelo usuário seja sempre literal.
function escaparLike(texto) {
  return texto.replace(/[\\%_]/g, "\\$&");
}

module.exports = {
  normalizarTexto,
  escaparLike,
};
