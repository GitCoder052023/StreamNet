const { checkRateLimit, updateCount, clearUser } = require('../utils/rateLimit.utils');
const { signMessage } = require('../utils/auth.utils');
const { MAX_MESSAGE_LENGTH } = require('../config/app.config');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../Server/config/security');

const onlineUsers = new Map();

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
    onlineUsers.set(socket.user.userId, {
      username: socket.user.fullName,
      socketId: socket.id,
      lastSeen: new Date().toISOString(),
      status: 'online'
    });

    io.emit('user-connected', {
      userId: socket.user.userId,
      username: socket.user.fullName,
      timestamp: new Date().toISOString()
    });

    socket.on('request-users-list', () => {
      const usersList = Array.from(onlineUsers.entries()).map(([userId, data]) => ({
        userId,
        username: data.username,
        lastSeen: data.lastSeen,
        status: data.status
      }));
      socket.emit('users-list-update', usersList);
    });

    socket.on('user-status-update', (data) => {
      const user = onlineUsers.get(data.userId);
      if (user) {
        user.status = data.status;
        user.lastSeen = new Date().toISOString();
        onlineUsers.set(data.userId, user);
        io.emit('users-list-update', Array.from(onlineUsers.entries()).map(([userId, data]) => ({
          userId,
          username: data.username,
          lastSeen: data.lastSeen,
          status: data.status
        })));
      }
    });

    socket.on('heartbeat', () => {
      const user = onlineUsers.get(socket.user.userId);
      if (user) {
        user.lastSeen = new Date().toISOString();
        onlineUsers.set(socket.user.userId, user);
      }
    });

    socket.on('typing', (isTyping) => {
      socket.broadcast.emit('typing', {
        userId: socket.user.userId,  
        username: socket.user.fullName,
        typing: isTyping,
      });
    });

    socket.on('chat-message', (messageData) => {
      if (messageData.content.length > MAX_MESSAGE_LENGTH) {
        return;
      }

      if (!checkRateLimit(socket.id)) {
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
        timestamp: new Date().toISOString()
      });
    });

      socket.on('disconnect', () => {
        const user = onlineUsers.get(socket.user.userId);
        if (user) {
          user.status = 'offline';
          user.lastSeen = new Date().toISOString();
          setTimeout(() => {
            onlineUsers.delete(socket.user.userId);
            io.emit('users-list-update', Array.from(onlineUsers.entries()).map(([userId, data]) => ({
              userId,
              username: data.username,
              lastSeen: data.lastSeen,
              status: data.status
            })));
          }, 300000);
        }
  
        io.emit('user-disconnected', {
          userId: socket.user.userId,
          username: socket.user.fullName,
          timestamp: new Date().toISOString()
        });
  
        clearUser(socket.id);
      });
    });
  };