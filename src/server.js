const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const crypto = require('crypto');
require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT;
const RATE_LIMIT = 5;

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY || path.join(__dirname, '/path/to/your/key.pem')),
  cert: fs.readFileSync(process.env.SSL_CERT || path.join(__dirname, '/path/to/your/cert.pem')),
};

const server = https.createServer(sslOptions, app);
const io = socketIO(server);

const secretKey = process.env.SECRET_KEY;
const userMessageCount = {};

function signMessage(message) {
  return crypto.createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
}

io.on('connection', (socket) => {
  socket.on('chat-message', (message) => {
    const userId = socket.id;
    const now = Date.now();

    if (!userMessageCount[userId]) {
      userMessageCount[userId] = { count: 0, lastReset: now };
    }

    if (now - userMessageCount[userId].lastReset > 10000) {
      userMessageCount[userId] = { count: 0, lastReset: now };
    }

    if (userMessageCount[userId].count >= RATE_LIMIT) {
      return;
    }

    userMessageCount[userId].count++;

    const signature = signMessage(message);
    io.emit('chat-message', {
      id: socket.id,
      message,
      signature,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    delete userMessageCount[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});