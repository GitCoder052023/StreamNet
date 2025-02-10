import { socket } from './chat/socket.js';
import {
  appTitle, sidebar, sidebarBackdrop, closeSidebar,
  messageInput, sendButton, cancelReplyButton, chat
} from './chat/elements.js';
import { initUserProfile, setupProfileEvents } from './chat/profile.js';
import { sendMessage, processIncomingMessage, messagesCache, handleMessageClick, typingIndicators, clearReply, updateMessageAlignment } from './chat/chat.js';
import { updateUsersList, handleUserConnected, handleUserDisconnected, updateUsersListFromUsers } from './chat/users.js';
import { scrollToBottom, getColorClass, getInitial } from './chat/helpers.js';

let typingTimeout;

function setupUIListeners() {
  appTitle.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('opacity-0', 'invisible');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('opacity-0', 'invisible');
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  sendButton.addEventListener('click', sendMessage);

  cancelReplyButton.addEventListener('click', clearReply);

  messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('typing', false);
    }, 1000);
  });
}

function setupSocketListeners() {
  socket.on('connect', async () => {
    await initUserProfile();
    updateMessageAlignment();
  });

  socket.on('chat-message', (data) => {
    processIncomingMessage(data);
  });

  socket.on('chat-history', (messages) => {
    chat.innerHTML = '';
    for (const key in messagesCache) {
      delete messagesCache[key];
    }
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid chat history received');
      return;
    }
    messages.forEach((data) => {
      try {
        processIncomingMessage(data);
      } catch (error) {
        console.error('Error processing message:', error, data);
      }
    });
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
            ${getInitial(username)}
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
    handleUserConnected(data);
    try {
      const token = localStorage.getItem('qchat_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.fullName && payload.userId) {
      }
    } catch (error) {
      console.error('Error updating profile info:', error);
    }
  });

  socket.on('user-disconnected', (data) => {
    handleUserDisconnected(data);
  });

  socket.on('users-list-update', (users) => {
    updateUsersListFromUsers(users);
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
}

window.addEventListener('beforeunload', () => {
  socket.emit('user-status-update', { userId: '', status: 'offline' });
});

function setupSidebarResizer() {
  if (window.innerWidth < 768) return;
  const sidebarResizer = document.getElementById('sidebar-resizer');
  if (!sidebarResizer) return;
  let isResizing = false;
  const defaultMaxWidth = parseFloat(window.getComputedStyle(sidebar).width);
  const minWidth = window.innerWidth * 0.20;
  sidebarResizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const sidebarRect = sidebar.getBoundingClientRect();
    let newWidth = e.clientX - sidebarRect.left;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > defaultMaxWidth) newWidth = defaultMaxWidth;
    sidebar.style.width = newWidth + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

function init() {
  setupUIListeners();
  setupSocketListeners();
  setupProfileEvents();
  setupSidebarResizer();
}

init();
