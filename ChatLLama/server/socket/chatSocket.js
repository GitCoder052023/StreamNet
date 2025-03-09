const { Server } = require('socket.io');
const getLocalIPv4 = require('../utils/getLocalIPv4');
const { addToQueue, removeFromQueue, stopProcessing, resetChatHistory } = require('../services/chatService');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        `http://${getLocalIPv4()}:3001`
      ],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
      addToQueue(socket, data.message, data.model, data.conversationId);
    });

    socket.on('stop chat message', () => {
      stopProcessing(socket);
    });

    socket.on('reset_chat', () => {
      resetChatHistory(socket.id);
    });

    socket.on('disconnect', () => {
      removeFromQueue(socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;