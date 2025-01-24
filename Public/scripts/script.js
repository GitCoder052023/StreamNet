const socket = io();

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chat = document.getElementById('chat');

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

socket.on('chat-message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.className = 'flex items-start space-x-3 mb-4';

  const sanitizedMessage = sanitizeMessage(data.message);
  const time = new Date(data.timestamp).toLocaleTimeString();

  messageElement.innerHTML = `
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold shadow-md">
            ${data.id.slice(0, 2)}
        </div>
        <div>
            <p class="text-sm text-gray-400 mb-1">User ${data.id}</p>
            <div class="bg-gray-700 p-3 rounded-lg max-w-md shadow-md">
                <p>${sanitizedMessage}</p>
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
