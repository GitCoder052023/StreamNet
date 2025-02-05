const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/QChat')
      .then(client => {
        console.log('Connected to MongoDB');
        dbConnection = client.db();
        return cb();
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        return cb(err);
      });
  },
  getDb: () => {
    if (!dbConnection) {
      throw new Error('No database connection established');
    }
    return dbConnection;
  }
};  
