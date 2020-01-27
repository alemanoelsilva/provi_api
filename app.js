const express = require('express');
const bodyParser = require('body-parser');

const { responseNotFound } = require('./middlewares/not-found');
const { error } = require('./middlewares/error');

const routes = require('./routes/user');

module.exports = () => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  routes(app);

  app.use(responseNotFound);
  app.use(error);

  return app;
};
