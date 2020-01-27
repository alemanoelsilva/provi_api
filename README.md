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

BACKUP_FILE_LOG=/log/provi.log
```

### Running on the app

```shell
npm start
```

### Running on the local unit and integration test 

```shell
npm run test:unit
npm run test:integration
```
