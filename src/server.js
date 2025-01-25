const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const crypto = require('crypto');
require('dotenv').config();

const app = require('./app');

const { PORT } = process.env;
const RATE_LIMIT = 5;
const MAX_MESSAGE_LENGTH = 5000;

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT),
};

const server = https.createServer(sslOptions, app);
const io = socketIO(server);

const secretKey = process.env.SECRET_KEY;
const userMessageCount = {};

function signMessage(message) {
  return crypto.createHmac('sha256', secretKey).update(message).digest('hex');
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  io.emit('user-connected', socket.id);

  socket.on('chat-message', (messageData) => {
    const userId = socket.id;
    const now = Date.now();
  
    if (!userMessageCount[userId]) {
      userMessageCount[userId] = { count: 0, lastReset: now };
    }
  
    if (now - userMessageCount[userId].lastReset > 10000) {
      userMessageCount[userId] = { count: 0, lastReset: now };
    }
  
    if (userMessageCount[userId].count >= RATE_LIMIT) {
      console.log(`Rate limit exceeded for user: ${userId}`);
      return;
    }
  
    if (messageData.content.length > MAX_MESSAGE_LENGTH) {
      console.log(`Message from user ${userId} exceeds maximum length`);
      return;
    }
  
    userMessageCount[userId].count++;
  
    const signature = signMessage(messageData.content);
  
    io.emit('chat-message', {
      id: socket.id, 
      message: messageData.content, 
      messageId: messageData.messageId, 
      replyTo: messageData.replyTo, 
      signature: signature, 
      timestamp: new Date().toISOString() 
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit('user-disconnected', socket.id);
    delete userMessageCount[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
