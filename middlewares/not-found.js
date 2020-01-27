exports.responseNotFound = (request, response) => {
  response.status(404)
    .json({ message: 'Endpoint not found' })
    .end();
};
