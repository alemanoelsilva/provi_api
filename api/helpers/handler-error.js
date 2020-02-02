exports.onError = response => ({
  statusCode = 500,
  message = 'Internal Server Error',
  success = false,
}) => response
  .status(statusCode)
  .json({ success, message })
  .end();
