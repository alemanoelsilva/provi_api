exports.onError = response => ({
  statusCode = 400,
  message = 'Erro interno',
}) => response
  .status(statusCode)
  .json({ message })
  .end();
