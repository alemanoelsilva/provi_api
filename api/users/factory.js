const moment = require('moment');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const { cpf } = require('cpf-cnpj-validator');
const cep = require('awesome-cep');

const logger = require('../../config/logger');
const { db, sequenceEndpoints } = require('../../config/environment');

const { getConnection } = require('../../config/mongo')();

const adapter = require('./adapter');
const {getNextEndpoint} = require('../helpers/handler-endpoints');

const orderEndpointRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.orderEndpointCollection,
  uuid: uuidv4,
});

const userRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.userCollection,
  uuid: uuidv4,
});

const cpfRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.cpfCollection,
  uuid: uuidv4,
});

const fullnameRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.fullnameCollection,
  uuid: uuidv4,
});

const birthdateRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.birthdateCollection,
  uuid: uuidv4,
});

const phonenumberRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.phonenumberCollection,
  uuid: uuidv4,
});

const addressRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.addressCollection,
  uuid: uuidv4,
});

const amountRequestedRepository = require('./repository')({
  db: getConnection(),
  collectionName: db.amountRequestedCollection,
  uuid: uuidv4,
});

const { onSuccess } = require('../helpers/handler-success');
const { onError } = require('../helpers/handler-error');

const getToken = data => uuidv5(data, uuidv5.URL);

module.exports = ({
  signUp: (request, response) => adapter.signUp({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
        save: userRepository.save,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
        save: orderEndpointRepository.save,
      },
    },
    getToken,
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'user'),
    sequenceEndpoints,
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  signIn: (request, response) => adapter.signIn({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  cpf: (request, response) => adapter.cpf({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      cpf: {
        find: cpfRepository.find,
        save: cpfRepository.save,
        update: cpfRepository.update,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'cpf'),
    isCpfValid: cpf.isValid,
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  fullname: (request, response) => adapter.fullname({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      fullname: {
        find: fullnameRepository.find,
        save: fullnameRepository.save,
        update: fullnameRepository.update,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'full-name'),
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  birthdate: (request, response) => adapter.birthdate({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      birthdate: {
        find: birthdateRepository.find,
        save: birthdateRepository.save,
        update: birthdateRepository.update,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'birth-date'),
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  phonenumber: (request, response) => adapter.phonenumber({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      phonenumber: {
        find: phonenumberRepository.find,
        save: phonenumberRepository.save,
        update: phonenumberRepository.update,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'phone-number'),
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  address: (request, response) => adapter.address({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      address: {
        find: addressRepository.find,
        save: addressRepository.save,
        update: addressRepository.update,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getAddress: cep.findCEP,
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'address'),
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),

  amountRequested: (request, response) => adapter.amountRequested({
    payload: request.body,
    repository: {
      user: {
        find: userRepository.find,
      },
      amountRequested: {
        save: amountRequestedRepository.save,
      },
      orderEndpoint: {
        find: orderEndpointRepository.find,
      },
    },
    getNextEndpoint: getNextEndpoint(sequenceEndpoints, 'amount-requested'),
    logger,
    onSuccess: onSuccess(response),
    onError: onError(response),
  }),
});
