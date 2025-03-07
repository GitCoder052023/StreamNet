const { MongoClient } = require('mongodb');

let dbConnection;
let isConnecting = false;
let connectionPromise = null;

module.exports = {
  connectToDb: (cb) => {
    if (isConnecting) {
      return connectionPromise.then(() => cb()).catch(cb);
    }

    isConnecting = true;
    connectionPromise = MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/StreamNet')
      .then(client => {
        console.log('Connected to MongoDB');
        dbConnection = client.db();
        isConnecting = false;
        cb();
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        isConnecting = false;
        cb(err);
      });

    return connectionPromise;
  },

  getDb: () => {
    if (!dbConnection) {
      throw new Error('No database connection established');
    }
    return dbConnection;
  }
};
