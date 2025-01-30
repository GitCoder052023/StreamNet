const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/QChat')
      .then(client => {
        dbConnection = client.db();
        return cb();
      })
      .catch(err => {
        console.error('Connection error:', err);
        return cb(err);
      });
  },
  getDb: () => dbConnection
};