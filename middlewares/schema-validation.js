const Joi = require('joi');

exports.requestValidation = ({ schema, requestType }) => (request, response, next) => {
  const { error, value } = Joi.validate(request[requestType], schema);
  if (error) return next(error);

  request[requestType] = value;

  return next();
};
