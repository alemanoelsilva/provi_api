const moment = require('moment');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

const logger = require('../../config/logger');
const { db: { userCollection } } = require('../../config/environment');

const { getConnection } = require('../../config/mongo')();

const adapter = require('./adapter');

const userRepository = require('./repository')({
  db: getConnection(),
  collectionName: userCollection,
  uuid: uuidv4,
});

const { onSuccess } = require('../helpers/handler-success');
const { onError } = require('../helpers/handler-error');

const getToken = data => uuidv5(data, uuidv5.URL);

module.exports = ({
  signUp: (request, response) => adapter.create({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
        save: userRepository.save,
      },
    },
    getToken,
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),
});
