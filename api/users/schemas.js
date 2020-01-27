const Joi = require('joi');

exports.requestSignUp = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phones: Joi.array().items(Joi.object({
    number: Joi.number().required(),
    ddd: Joi.number().required(),
  })).required(),
});

exports.requestSignIn = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).required();

exports.requestUser = Joi.object({
  id: Joi.string().guid().required(),
}).required();

exports.requestToken = Joi.object({
  bearer: Joi.string().guid().required(),
}).unknown(true);
