require('dotenv').load();

const ENVIRONMENT = {
  TEST: 'test',
  DEV: 'development',
};

const env = process.env.NODE_ENV || ENVIRONMENT.DEV;

module.exports = {
  env,
  app: {
    port: process.env.PORT,
  },
  logger: {
    level: env === ENVIRONMENT.TEST ? 'fatal' : process.env.LOGGER_LEVEL,
    backupFileLog: process.env.BACKUP_FILE_LOG,
  },
  db: {
    database: env === ENVIRONMENT.TEST
      ? process.env.DATABASE_TEST_URL
      : process.env.DATABASE_URL,
    dbName: env === ENVIRONMENT.TEST
      ? process.env.DB_NAME_TEST
      : process.env.DB_NAME,
    userCollection: process.env.USER_COLLECTION_NAME,
    cpfCollection: process.env.CPF_COLLECTION_NAME,
    fullnameCollection: process.env.FULL_NAME_COLLECTION_NAME,
    birthdayCollection: process.env.BIRTHDAY_COLLECTION_NAME,
    phonenumberCollection: process.env.PHONE_NUMBER_COLLECTION_NAME,
    addressCollection: process.env.ADDRESS_COLLECTION_NAME,
    amountrequestedCollection: process.env.AMOUNT_REQUESTED_COLLECTION_NAME,
  },
};
