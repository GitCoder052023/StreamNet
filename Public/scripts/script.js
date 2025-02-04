const token = localStorage.getItem('qchat_token');
const socket = io({
  auth: {
    token: token
  }
});

const profileButton = document.getElementById('profile-button');
const profilePopup = document.getElementById('profile-popup');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const logoutButton = document.getElementById('logout-button');
const profileAvatar = document.getElementById('profile-avatar');
const profilePopupAvatar = document.getElementById('profile-popup-avatar');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chat = document.getElementById('chat');
const messagesCache = {};
const typingIndicators = {};
let mySocketId = null;
let currentReplyId = null;
let myEmail = null;
let onlineUsers = new Map();

document.querySelector('.app-title').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('-translate-x-full');
  document.getElementById('sidebar-backdrop').classList.remove('opacity-0', 'invisible');
});

document.getElementById('close-sidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebar-backdrop').classList.add('opacity-0', 'invisible');
});

function sanitizeMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  return div.innerHTML;
}

function updateAvatars(userId, username) {
  const colorClass = getColorClass(userId);
  const initial = getInitial(username);

  profileAvatar.className = `w-full h-full rounded-full flex items-center justify-center ${colorClass}`;
  profileAvatar.textContent = initial;

  profilePopupAvatar.className = `w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`;
  profilePopupAvatar.textContent = initial;
}

function updateUsersList() {
  const usersList = document.getElementById('users-list');
  usersList.innerHTML = '';
  
  onlineUsers.forEach((user, userId) => {
    const userElement = document.createElement('div');
    userElement.className = 'flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors';
    userElement.innerHTML = `
      <div class="relative">
        <div class="w-10 h-10 ${user.colorClass} rounded-full flex items-center justify-center font-bold">
          ${user.avatar}
        </div>
        <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
      </div>
      <div class="flex flex-col">
        <span class="text-white font-medium">${user.username}</span>
        <span class="text-xs text-gray-400">Active now</span>
      </div>
    `;
    usersList.appendChild(userElement);
  });
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
      original.senderId === mySocketId ? 'You' : original.senderName;
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

function getInitial(username) {
  return username.charAt(0).toUpperCase();
}

socket.on('chat-message', (data) => {
  messagesCache[data.messageId] = {
    content: data.message,
    senderId: data.id,
    senderName: data.username,
    timestamp: data.timestamp
  };

  const isMyMessage = data.id === myEmail;

  const messageElement = document.createElement('div');
  messageElement.className = `message-container flex items-start gap-3 mb-4 ${isMyMessage ? 'justify-end' : ''}`;

  messageElement.addEventListener('click', () => handleMessageClick(data.messageId));

  let replyPreview = '';
  if (data.replyTo) {
    const original = messagesCache[data.replyTo];
    replyPreview = `
      <div class="reply-preview bg-gray-600 p-2 rounded mb-2 text-sm border-l-4 border-blue-500 max-w-md">
        ${original ? `
          <p class="text-gray-300 font-medium">
            ${original.senderId === data.id ? 'You' : original.senderId === myEmail ? 'You' : original.senderName}
          </p>
          <p class="text-gray-400 truncate">${sanitizeMessage(original.content)}</p>
        ` : '<p class="text-gray-400">Original message unavailable</p>'}
      </div>
    `;
  }

  const sanitizedMessage = sanitizeMessage(data.message);
  const time = new Date(data.timestamp).toLocaleTimeString();

  messageElement.innerHTML = isMyMessage ? `
    <div class="flex-grow"></div>
    <div class="sent-message-container flex items-start gap-3">
      <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md sent-avatar">
        ${getInitial(data.username)}
      </div>
      <div class="text-left max-w-md">
        <p class="text-sm text-gray-400 mb-1">You</p>
        ${replyPreview}
        <div class="bg-blue-500 p-3 rounded-lg shadow-md">
          <p class="text-left">${sanitizedMessage}</p>
        </div>
        <p class="text-xs text-gray-500 mt-1 text-right">${time}</p>
      </div>
    </div>
  ` : `
    <div class="received-message-container flex items-start gap-3">
      <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md">
        ${getInitial(data.username)}
      </div>
      <div class="max-w-md">
        <p class="text-sm text-gray-400 mb-1">${data.username}</p>
        ${replyPreview}
        <div class="bg-gray-700 p-3 rounded-lg shadow-md">
          <p class="text-left">${sanitizedMessage}</p>
        </div>
        <p class="text-xs text-gray-500 mt-1 text-right">${time}</p>
      </div>
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
  const { userId, typing, username } = data;

  if (typing) {
    if (!typingIndicators[userId]) {
      const typingElement = document.createElement('div');
      typingElement.className = 'message-container flex items-start gap-3 mb-4';
      typingElement.id = `typing-${userId}`;

      typingElement.innerHTML = `
        <div class="w-10 h-10 ${getColorClass(userId)} rounded-full flex items-center justify-center font-bold shadow-md">
          ${getInitial(username)}  <!-- Use the real username initial -->
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
  onlineUsers.set(data.userId, {
    username: data.username,
    avatar: getInitial(data.username),
    colorClass: getColorClass(data.userId)
  });
  updateUsersList();

  const time = new Date(data.timestamp).toLocaleTimeString();
  const firstName = data.username.split(' ')[0];
  
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      ${firstName} connected • ${time}
    </span>
  `;
  chat.appendChild(messageElement);
  scrollToBottom();

  const token = localStorage.getItem('qchat_token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId;
  const fullName = payload.fullName;

  profileName.textContent = fullName;
  profileEmail.textContent = userId;
  updateAvatars(userId, fullName);
});

socket.on('user-disconnected', (data) => {
  onlineUsers.delete(data.userId);
  updateUsersList();

  const time = new Date(data.timestamp).toLocaleTimeString();
  const firstName = data.username.split(' ')[0];
  
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      ${firstName} disconnected • ${time}
    </span>
  `;
  chat.appendChild(messageElement);
  scrollToBottom();
});

socket.on('connect', () => {
  const token = localStorage.getItem('qchat_token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  myEmail = payload.userId;

  socket.emit('request-users-list');
  
  socket.emit('user-status-update', {
    userId: myEmail,
    status: 'online'
  });
});

window.addEventListener('beforeunload', () => {
  socket.emit('user-status-update', {
    userId: myEmail,
    status: 'offline'
  });
});

setInterval(() => {
  if (socket.connected) {
    socket.emit('heartbeat');
  }
}, 30000);

socket.on('users-list-update', (users) => {
  onlineUsers.clear();
  users.forEach(user => {
    onlineUsers.set(user.userId, {
      username: user.username,
      avatar: getInitial(user.username),
      colorClass: getColorClass(user.userId),
      lastSeen: user.lastSeen
    });
  });
  updateUsersList();
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

profileButton.addEventListener('click', () => {
  profilePopup.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!profileButton.contains(e.target) && !profilePopup.contains(e.target)) {
    profilePopup.classList.add('hidden');
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    const token = localStorage.getItem('qchat_token');
    const backendHost = document.querySelector('meta[name="backend-host"]')?.content || process.env.HOST || window.location.hostname;
    
    const response = await fetch(`https://${backendHost}:4000/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    localStorage.removeItem('qchat_token');
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
});