# Configuration

## To initialize the application

### Create `.env` file 

```
NODE_ENV=development

LOGGER_LEVEL=trace

PORT=3000

DATABASE_URL=mongodb://localhost:27017/provi
DATABASE_TEST_URL=mongodb://localhost:27017/provi_test

DB_NAME=provi
DB_NAME_TEST=provi_test

USER_COLLECTION_NAME=user_collection
CPF_COLLECTION_NAME=cpf_collection
FULL_NAME_COLLECTION_NAME=fullname_collection
BIRTH_DATE_COLLECTION_NAME=birthdate_collection
PHONE_NUMBER_COLLECTION_NAME=phonenumber_collection
ADDRESS_COLLECTION_NAME=address_collection
AMOUNT_REQUESTED_COLLECTION_NAME=amountrequested_collection

ORDER_ENDPOINT_COLLECTION_NAME=orderendpoint_collection

DEFAULT_SEQUENCE_ENDPOINTS=user,cpf,full-name,birth-date,phone-number,address,amount-requested,congrats


BACKUP_FILE_LOG=/log/provi.log
```

### Running on the app

```shell
npm start
```

### Running on the local unit

```shell
npm run test:unit
```
