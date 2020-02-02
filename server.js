const { MongoClient } = require('mongodb');

const logger = require('./config/logger');
const { connect } = require('./config/mongo')(MongoClient, logger);

const { app: { port } } = require('./config/environment');
const { db } = require('./config/environment');

async function init() {
  try {
    await connect(db);
  } catch (error) {
    return null;
  }

  /*eslint-disable */
  const app = require('./app')();

  await app.listen(port);

  return logger.info(`Application is running on port ${port}`);
}

init();
