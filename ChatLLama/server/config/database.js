const mongoose = require('mongoose');

function connectDatabase() {
  mongoose
    .connect('mongodb://localhost:27017/ChatLLama', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
}

module.exports = connectDatabase;