function errorHandler(error, req, res, next) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Ocorreu um erro interno no servidor.",
  });
}

module.exports = errorHandler;
