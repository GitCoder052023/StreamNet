const { checkRateLimit, updateCount, clearUser } = require('../utils/rateLimit.utils');
const { signMessage } = require('../utils/auth.utils');
const { MAX_MESSAGE_LENGTH } = require('../config/app.config');

module.exports = (io) => {
  io.on('connection', (socket) => {
    io.emit('user-connected', {
      userId: socket.id,
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
        id: socket.id,
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
        userId: socket.id,
        timestamp: new Date().toISOString(),
      });
      clearUser(socket.id);
    });
  });
};