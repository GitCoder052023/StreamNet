const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  modelName: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  title: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversations', conversationSchema); 