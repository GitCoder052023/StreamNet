const socket = io();

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chat = document.getElementById('chat');
const messagesCache = {};
const typingIndicators = {};
let mySocketId = null;
let currentReplyId = null;

function sanitizeMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  return div.innerHTML;
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (message && message.length <= 5000) {
    const messageData = {
      content: message,
      replyTo: currentReplyId,
      messageId: crypto.randomUUID()
    };
    socket.emit('chat-message', messageData);
    messageInput.value = '';
    currentReplyId = null;
    document.getElementById('reply-preview').classList.add('hidden');
  } else if (message.length > 5000) {
    alert('Message exceeds the maximum length of 5000 characters.');
  }
}

function handleMessageClick(messageId) {
  currentReplyId = messageId;
  const original = messagesCache[messageId];
  if (original) {
    const preview = document.getElementById('reply-preview');
    preview.classList.remove('hidden');
    document.getElementById('reply-user').textContent = 
      original.senderId === mySocketId ? 'You' : `User ${original.senderId.slice(0,2)}`;
    document.getElementById('reply-content').textContent = original.content;
  }
}

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);

function getColorClass(userId) {
  const colors = [
    'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
    'bg-orange-500', 'bg-red-600', 'bg-green-600', 'bg-yellow-600',
    'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600',
    'bg-teal-600', 'bg-orange-600'
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

document.getElementById('cancel-reply').addEventListener('click', () => {
  currentReplyId = null;
  document.getElementById('reply-preview').classList.add('hidden');
});

socket.on('chat-message', (data) => {
  messagesCache[data.messageId] = {
    content: data.message,
    senderId: data.id,
    timestamp: data.timestamp
  };

  const isMyMessage = data.id === mySocketId;
  
  const messageElement = document.createElement('div');
  messageElement.className = `message-container flex items-start gap-3 mb-4 ${isMyMessage ? 'justify-end' : ''}`;
  
  messageElement.addEventListener('click', () => handleMessageClick(data.messageId));

  let replyPreview = '';
  if (data.replyTo) {
    const original = messagesCache[data.replyTo];
    const replyClass = isMyMessage ? 'my-message' : 'other-message';
    replyPreview = `
      <div class="reply-preview ${replyClass} bg-gray-600 p-2 rounded mb-2 text-sm border-l-4 border-blue-500">
        ${original ? `
          <p class="text-gray-300">Replying to ${original.senderId === data.id ? 'You' : `User ${original.senderId.slice(0,2)}`}</p>
          <p class="text-gray-400 truncate">${sanitizeMessage(original.content)}</p>
        ` : '<p class="text-gray-400">Original message unavailable</p>'}
      </div>
    `;
  }

  const sanitizedMessage = sanitizeMessage(data.message);
  const time = new Date(data.timestamp).toLocaleTimeString();

  messageElement.innerHTML = `
    <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md">
        ${data.id.slice(0, 2)}
    </div>
    <div class="${isMyMessage ? 'text-right' : ''}">
        <p class="text-sm text-gray-400 mb-1 text-left">${isMyMessage ? 'You' : `User ${data.id}`}</p>
        ${replyPreview}
        <div class="${isMyMessage ? 'bg-blue-500' : 'bg-gray-700'} p-3 rounded-lg max-w-md shadow-md">
            <p class="text-left">${sanitizedMessage}</p>
        </div>
        <p class="text-xs text-gray-500 mt-1">${time}</p>
    </div>
  `;

  chat.appendChild(messageElement);
  scrollToBottom();
});

let typingTimeout;
messageInput.addEventListener('input', () => {
  socket.emit('typing', true);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', false);
  }, 1000);
});

socket.on('typing', (data) => {
  const { userId, typing } = data;

  if (typing) {
    if (!typingIndicators[userId]) {
      const typingElement = document.createElement('div');
      typingElement.className = 'message-container flex items-start gap-3 mb-4';
      typingElement.id = `typing-${userId}`;

      typingElement.innerHTML = `
        <div class="w-10 h-10 ${getColorClass(userId)} rounded-full flex items-center justify-center font-bold shadow-md">
          ${userId.slice(0, 2)}
        </div>
        <div class="bg-gray-700 p-3 rounded-lg max-w-md shadow-md flex items-center">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;

      chat.appendChild(typingElement);
      typingIndicators[userId] = typingElement;
      scrollToBottom();
    }
  } else {
    const typingElement = typingIndicators[userId];
    if (typingElement) {
      chat.removeChild(typingElement);
      delete typingIndicators[userId];
    }
  }
});


socket.on('user-connected', (data) => {
  const time = new Date(data.timestamp).toLocaleTimeString();
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      User ${data.userId.slice(0, 5)} connected • ${time}
    </span>
  `;
  chat.appendChild(messageElement);
  scrollToBottom();
});

socket.on('user-disconnected', (data) => {
  const time = new Date(data.timestamp).toLocaleTimeString();
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      User ${data.userId.slice(0, 5)} disconnected • ${time}
    </span>
  `;
  chat.appendChild(messageElement);
  scrollToBottom();
});

socket.on('connect', () => {
  mySocketId = socket.id;
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

socket.on('reconnect_attempt', () => {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
  } else {
    socket.disconnect();
    console.log('Max reconnection attempts reached');
  }
});

socket.on('reconnect', () => {
  console.log('Reconnected to server');
  reconnectAttempts = 0;
});
