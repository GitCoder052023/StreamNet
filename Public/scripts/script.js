const socket = io();

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chat = document.getElementById('chat');

// Function to sanitize messages to prevent script injection
function sanitizeMessage(message) {
  const div = document.createElement('div');
  div.textContent = message; // Escapes HTML tags
  return div.innerHTML;
}

// Function to scroll the chat to the bottom
function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message && message.length <= 5000) { // Check message length
    socket.emit('chat-message', message);
    messageInput.value = ''; // Clear the input field
  } else if (message.length > 5000) {
    alert('Message exceeds the maximum length of 5000 characters.'); // Alert if message is too long
  }
}

// Event listener for Enter key in the message input
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for receiving chat messages
socket.on('chat-message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.className = 'flex items-start space-x-3 mb-4';

  // Sanitize the message to prevent script injection
  const sanitizedMessage = sanitizeMessage(data.message);
  const time = new Date(data.timestamp).toLocaleTimeString();

  // Construct the message element
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

  // Append the message to the chat container
  chat.appendChild(messageElement);
  scrollToBottom(); // Scroll to the bottom of the chat
});

// Event listener for successful connection to the server
socket.on('connect', () => {
  console.log('Connected to server');
});

// Event listener for disconnection from the server
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Event listener for connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Reconnection logic
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

// Event listener for successful reconnection
socket.on('reconnect', () => {
  console.log('Reconnected to server');
  reconnectAttempts = 0;
});