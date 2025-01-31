const { checkRateLimit, updateCount, clearUser } = require('../utils/rateLimit.utils');
const { signMessage } = require('../utils/auth.utils');
const { MAX_MESSAGE_LENGTH } = require('../config/app.config');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../Server/config/security');

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    io.emit('user-connected', {
      userId: socket.user.userId,
      username: socket.user.fullName,
      timestamp: new Date().toISOString(),
    });

    socket.on('typing', (isTyping) => {
      socket.broadcast.emit('typing', {
        userId: socket.id,
        typing: isTyping,
      });
    });

    socket.on('chat-message', (messageData) => {
      if (messageData.content.length > MAX_MESSAGE_LENGTH) {
        console.log(`Message from ${socket.id} exceeds length limit`);
        return;
      }

      if (!checkRateLimit(socket.id)) {
        console.log(`Rate limit exceeded for ${socket.id}`);
        return;
      }

      updateCount(socket.id);

      const signature = signMessage(messageData.content);

      io.emit('chat-message', {
        id: socket.user.userId,
        username: socket.user.fullName,
        message: messageData.content,
        messageId: messageData.messageId,
        replyTo: messageData.replyTo,
        signature,
        timestamp: new Date().toISOString(),
      });

      socket.broadcast.emit('typing', {
        userId: socket.id,
        typing: false,
      });
    });

    socket.on('disconnect', () => {
      io.emit('user-disconnected', {
        userId: socket.user.userId,
        username: socket.user.fullName,
        timestamp: new Date().toISOString(),
      });
      clearUser(socket.id);
    });
  });
};