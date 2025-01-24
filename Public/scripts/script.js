const socket = io();

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chat = document.getElementById('chat');
let mySocketId = null;

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
    socket.emit('chat-message', message);
    messageInput.value = '';
  } else if (message.length > 5000) {
    alert('Message exceeds the maximum length of 5000 characters.');
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

socket.on('chat-message', (data) => {
  const isMyMessage = data.id === mySocketId;
  
  const messageElement = document.createElement('div');
  messageElement.className = `flex items-start gap-3 mb-4 ${isMyMessage ? 'justify-end' : ''}`;

  const sanitizedMessage = sanitizeMessage(data.message);
  const time = new Date(data.timestamp).toLocaleTimeString();

  messageElement.innerHTML = `
    <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md">
        ${data.id.slice(0, 2)}
    </div>
    <div class="${isMyMessage ? 'text-right' : ''}">
        <p class="text-sm text-gray-400 mb-1 text-left">${isMyMessage ? 'You' : `User ${data.id}`}</p>
        <div class="${isMyMessage ? 'bg-blue-500' : 'bg-gray-700'} p-3 rounded-lg max-w-md shadow-md">
            <p class="text-left">${sanitizedMessage}</p>
        </div>
        <p class="text-xs text-gray-500 mt-1">${time}</p>
    </div>
  `;

  chat.appendChild(messageElement);
  scrollToBottom();
});

socket.on('user-connected', (userId) => {
  const shortId = userId.slice(0, 5);
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      User ${shortId} connected
    </span>
  `;
  chat.appendChild(messageElement);
  scrollToBottom();
});

socket.on('user-disconnected', (userId) => {
  const shortId = userId.slice(0, 5);
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      User ${shortId} disconnected
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
