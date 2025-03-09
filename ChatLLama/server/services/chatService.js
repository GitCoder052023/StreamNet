const axios = require('axios');
const readline = require('readline');
const Conversation = require('../models/Conversation');
const { OLLAMA_API_URL } = require('../config/config');

let isProcessing = false;
let chatQueue = [];
let runningRequests = {};
let chatHistories = {};

async function processOllamaModel(model, messages, onChunk, signal) {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/chat`,
      {
        model: model,
        messages: messages,
        stream: true
      },
      { responseType: 'stream', signal }
    );

    const rl = readline.createInterface({
      input: response.data,
      crlfDelay: Infinity
    });

    let fullResponse = '';
    let isThinking = false;

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const jsonData = JSON.parse(line);
          if (jsonData.message?.content) {
            const chunk = jsonData.message.content;

            if (chunk.includes('<think>')) {
              isThinking = true;
              onChunk(`<think>${chunk.replace('<think>', '')}`);
              continue;
            }

            if (chunk.includes('</think>')) {
              isThinking = false;
              onChunk(`${chunk.replace('</think>', '')}</think>`); 
              continue;
            }

            if (isThinking) {
              onChunk(`<think>${chunk}</think>`); 
              continue;
            }

            fullResponse += chunk;
            onChunk(chunk);
          }
        } catch (err) {
          console.error("Error parsing chunk:", err);
        }
      }
    }
    return fullResponse;
  } catch (error) {
    if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
      console.error("Error calling Ollama API:", error);
      onChunk("Error generating response.");
    }
    throw error;
  }
}

async function processQueue() {
  if (isProcessing || chatQueue.length === 0) return;
  isProcessing = true;

  const { socket, message, model, conversationId } = chatQueue.shift();

  if (!chatHistories[socket.id]) {
    chatHistories[socket.id] = [];
  }

  chatHistories[socket.id].push({ role: 'user', content: message });

  if (conversationId) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (conversation && conversation.messages.length === 0) {
        conversation.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
        conversation.messages.push({ content: message, role: 'user' });
        conversation.lastUpdated = Date.now();
        await conversation.save();
        
        socket.emit('conversation_updated', {
          id: conversationId,
          title: conversation.title
        });
      } else {
        await Conversation.findByIdAndUpdate(conversationId, {
          $push: { 
            messages: { 
              content: message, 
              role: 'user'
            } 
          },
          lastUpdated: Date.now()
        });
      }
    } catch (error) {
      console.error('Error saving user message:', error);
    }
  }

  socket.emit('chat response', { chunk: '[STREAM_START]', model });

  const controller = new AbortController();
  runningRequests[socket.id] = controller;

  try {
    const fullResponse = await processOllamaModel(
      model,
      [...chatHistories[socket.id]],
      (chunk) => socket.emit('chat response', { chunk }),
      controller.signal
    );

    chatHistories[socket.id].push({ role: 'assistant', content: fullResponse });

    if (conversationId) {
      try {
        await Conversation.findByIdAndUpdate(conversationId, {
          $push: { 
            messages: { 
              content: fullResponse, 
              role: 'assistant', 
              modelName: model 
            } 
          },
          lastUpdated: Date.now()
        });
      } catch (error) {
        console.error('Error saving assistant response:', error);
      }
    }
  } catch (error) {
    chatHistories[socket.id].pop();
  } finally {
    delete runningRequests[socket.id];
    socket.emit('chat response', { chunk: '[STREAM_END]' });
    isProcessing = false;
    if (chatQueue.length > 0) processQueue();
  }
}

function addToQueue(socket, message, model, conversationId) {
  chatQueue.push({ socket, message, model, conversationId });
  processQueue();
}

function resetChatHistory(socketId) {
  delete chatHistories[socketId];
}

function removeFromQueue(socketId) {
  chatQueue = chatQueue.filter(item => item.socket.id !== socketId);
  resetChatHistory(socketId);
}

function stopProcessing(socket) {
  if (runningRequests[socket.id]) {
    runningRequests[socket.id].abort();
    delete runningRequests[socket.id];
  }
}

module.exports = {
  addToQueue,
  removeFromQueue,
  stopProcessing,
  resetChatHistory
};