const https = require('https');
const socketIO = require('socket.io');
const { connectToDb } = require('../../Server/config/db');

connectToDb((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }

  const app = require('../app');
  const sslOptions = require('./config/ssl.config');
  const { PORT } = require('./config/app.config');
  const setupSocketIO = require('./sockets/connectionHandler');

  const server = https.createServer(sslOptions, app);
  const io = socketIO(server);

  setupSocketIO(io);

  server.listen(PORT, () => {
    console.log(`Engine is running on port ${PORT}`);
  });
});
