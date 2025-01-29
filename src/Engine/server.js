const https = require('https');
const socketIO = require('socket.io');
require('dotenv').config();

const app = require('../app');
const sslOptions = require('./config/ssl.config');
const { PORT } = require('./config/app.config');
const setupSocketIO = require('./sockets/connectionHandler');

// Create HTTPS server
const server = https.createServer(sslOptions, app);
const io = socketIO(server);

// Initialize Socket.IO handlers
setupSocketIO(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});