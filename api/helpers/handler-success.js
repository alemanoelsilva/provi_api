exports.onSuccess = response => ({
  statusCode = 200,
  data = {},
}) => response.status(statusCode).json(data).end();
