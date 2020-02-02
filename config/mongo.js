let state = {};

const MongoDB = (MongoClient, logger) => ({
  connect: async ({ database, dbName }) => {
    try {
      const client = await MongoClient.connect(database, {
        promiseLibrary: Promise,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      state.db = client.db(dbName);

      logger.info(`Database connected on dbName ${dbName}`);

      return state.db;
    } catch (error) {
      logger.error(`There is an error on MongoConnect ${error}`);
    }
  },

  disconnect: () => state.db.close().then(() => { state.db = null }),

  collection: (collectionName) => {
    if (state.db) return state.db.collection(collectionName);
    throw new Error('There is no connection to the database.');
  },

  getConnection: () => state.db,
});

module.exports = MongoDB;
