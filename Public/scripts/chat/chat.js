import { chat, messageInput, replyPreview } from './elements.js';
import { sanitizeMessage, getColorClass, getInitial, scrollToBottom, createStatusMessage } from './helpers.js';
import { socket } from './socket.js';
import { myEmail } from './profile.js';
import { onlineUsers } from './users.js';

export const messagesCache = {};
export let currentReplyId = null;
export const typingIndicators = {};

export function generateReplyPreview(original, senderId) {
  if (!original) {
    return '';
  }
  const replyUser = original.senderId === senderId || original.senderId === myEmail
    ? 'You'
    : original.senderName;
  return `
    <div class="reply-preview bg-gray-600 p-2 rounded mb-2 text-sm border-l-4 border-blue-500 max-w-md">
      <p class="text-gray-300 font-medium">${replyUser}</p>
      <p class="text-gray-400 truncate">${sanitizeMessage(original.content)}</p>
    </div>
  `;
}

export function generateMessageHTML(data, isMyMessage, replyPreviewHTML, time) {
  const senderNameDisplay = isMyMessage ? 'You' : data.username;
  const messageContent = sanitizeMessage(data.message);
  let userColor;

  if (data.colorClass) {
    userColor = data.colorClass;
  } else if (data.id === myEmail) {
    userColor = localStorage.getItem('avatarColorPreference') || getColorClass(data.id);
  } else {
    userColor = onlineUsers.get(data.id)?.colorClass || getColorClass(data.id);
  }

  if (isMyMessage) {
    return `
      <div class="flex-grow"></div>
      <div class="sent-message-container flex items-start gap-3">
        <div class="w-10 h-10 ${userColor} rounded-full flex items-center justify-center font-bold shadow-md sent-avatar">
          ${getInitial(data.username)}
        </div>
        <div class="text-left max-w-md relative">
          <p class="text-sm text-gray-400 mb-1">${senderNameDisplay}</p>
          ${replyPreviewHTML}
          <div class="bg-blue-500 p-3 rounded-lg shadow-md">
            <p class="text-left">${messageContent}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1 text-right">${time}</p>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="received-message-container flex items-start gap-3">
        <div class="w-10 h-10 ${userColor} rounded-full flex items-center justify-center font-bold shadow-md">
          ${getInitial(data.username)}
        </div>
        <div class="max-w-md">
          <p class="text-sm text-gray-400 mb-1">${data.username}</p>
          ${replyPreviewHTML}
          <div class="bg-gray-700 p-3 rounded-lg shadow-md">
            <p class="text-left">${messageContent}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1 text-right">${time}</p>
        </div>
      </div>
    `;
  }
}

export function createMessageElement(data) {
  const senderId = data.id || data.senderId;
  const currentUserEmail = myEmail || localStorage.getItem("qchat_email");
  const isMyMessage = currentUserEmail && (senderId === currentUserEmail);

  const messageElement = document.createElement('div');
  messageElement.dataset.messageId = data.messageId;
  messageElement.dataset.senderId = senderId;
  messageElement.className = `message-container flex items-start gap-3 mb-4 ${isMyMessage ? 'justify-end' : ''}`;

  messageElement.addEventListener('click', () => handleMessageClick(data.messageId));

  if (isMyMessage) {
    messageElement.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      showContextMenu(e, data.messageId);
    });

    let touchTimer = null;
    messageElement.addEventListener('touchstart', function (e) {
      touchTimer = setTimeout(() => {
        showContextMenu(e, data.messageId);
      }, 2000);
    });
    messageElement.addEventListener('touchend', function (e) {
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
    });
  }

  const replyPreviewHTML = data.replyTo
    ? generateReplyPreview(messagesCache[data.replyTo], senderId)
    : '';
  const time = new Date(data.timestamp).toLocaleTimeString();
  messageElement.innerHTML = generateMessageHTML(data, isMyMessage, replyPreviewHTML, time);
  return messageElement;
}


export function handleDeleteMessage(e, messageId, confirmDelete = true) {
  e.stopPropagation();
  if (confirmDelete && !confirm('Are you sure you want to delete this message?')) {
    return;
  }
  socket.emit('delete-message', messageId);
}

export function updateMessageAlignment() {
  const messages = chat.querySelectorAll('.message-container');
  messages.forEach(messageElement => {
    if (messageElement.dataset.senderId === myEmail) {
      messageElement.classList.add('justify-end');
    } else {
      messageElement.classList.remove('justify-end');
    }
  });
}

export function processIncomingMessage(data) {
  messagesCache[data.messageId] = {
      content: data.message,
      senderId: data.id,
      senderName: data.username,
      timestamp: data.timestamp
  };

  const messageElement = createMessageElement(data);

  const currentUserEmail = myEmail || localStorage.getItem("qchat_email");
  if (data.id === currentUserEmail) {
      messageElement.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          showContextMenu(e, data.messageId);
      });

      let touchTimer = null;
      messageElement.addEventListener('touchstart', function (e) {
          touchTimer = setTimeout(() => {
              showContextMenu(e, data.messageId);
          }, 2000);
      });
      messageElement.addEventListener('touchend', function (e) {
          if (touchTimer) {
              clearTimeout(touchTimer);
          }
      });
  }

  chat.appendChild(messageElement);
  scrollToBottom();
}

export function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  if (message.length > 5000) {
    alert('Message exceeds the maximum length of 5000 characters.');
    return;
  }
  const messageData = {
    content: message,
    replyTo: currentReplyId,
    messageId: crypto.randomUUID()
  };
  socket.emit('chat-message', messageData);
  messageInput.value = '';
  clearReply();
}

export function handleMessageClick(messageId) {
  currentReplyId = messageId;
  const original = messagesCache[messageId];
  if (original) {
    replyPreview.classList.remove('hidden');
    const replyUserElem = replyPreview.querySelector('#reply-user');
    const replyContentElem = replyPreview.querySelector('#reply-content');
    replyUserElem.textContent =
      original.senderId === myEmail ? 'You' : original.senderName;
    replyContentElem.textContent = original.content;
  }
}

export function clearReply() {
  currentReplyId = null;
  if (replyPreview) {
    replyPreview.classList.add('hidden');
  }
}

let currentContextMessageId = null;

const contextMenu = document.createElement('div');
contextMenu.id = 'message-context-menu';
contextMenu.className = 'absolute z-50 bg-gray-800 text-white rounded shadow-lg hidden';
contextMenu.innerHTML = `
  <div id="context-delete" class="context-option flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-red-600">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
    </svg>
    <span class="text-red-400">Delete Message</span>
  </div>
  <div id="context-edit" class="context-option flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-700">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.293.207l-4 1.5a1 1 0 01-1.26-1.26l1.5-4a1 1 0 01.207-.293l9.9-9.9a2 2 0 012.828 0z" />
    </svg>
    <span class="text-gray-300">Edit Message</span>
  </div>
  <div id="context-seen" class="context-option flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-700">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    <span class="text-gray-300">Seen Receipt</span>
  </div>
`;
document.body.appendChild(contextMenu);

function showContextMenu(event, messageId) {
  event.preventDefault();
  event.stopPropagation();
  currentContextMessageId = messageId;

  const messageElement = event.target.closest('.message-container');
  const messageBox = messageElement.querySelector('.bg-blue-500, .bg-gray-700');
  const rect = messageBox.getBoundingClientRect();

  const menuWidth = contextMenu.offsetWidth;
  const windowWidth = window.innerWidth;

  let posX = rect.left;

  if (windowWidth <= 768) {
      posX = Math.max(10, posX);
      posX = Math.min(windowWidth - menuWidth - 10, posX);
  }

  if (posX + menuWidth > windowWidth) {
      posX = windowWidth - menuWidth - 10;
  }

  contextMenu.style.left = `${posX - 70}px`;
  contextMenu.style.top = `${rect.bottom + 15}px`;
  contextMenu.classList.remove('hidden');
}

chat.addEventListener('contextmenu', function(e) {
  const messageContainer = e.target.closest('.message-container');
  if (!messageContainer) return;

  const senderId = messageContainer.dataset.senderId;
  const currentUserEmail = myEmail || localStorage.getItem("qchat_email");

  if (senderId === currentUserEmail) {
      e.preventDefault();
      showContextMenu(e, messageContainer.dataset.messageId);
  }
});

chat.addEventListener('touchstart', function(e) {
  const messageContainer = e.target.closest('.message-container');
  if (!messageContainer) return;

  const senderId = messageContainer.dataset.senderId;
  const currentUserEmail = myEmail || localStorage.getItem("qchat_email");

  if (senderId === currentUserEmail) {
      let touchTimer = setTimeout(() => {
          showContextMenu(e, messageContainer.dataset.messageId);
      }, 2000);

      messageContainer.addEventListener('touchend', () => {
          clearTimeout(touchTimer);
      }, { once: true });
  }
});


document.addEventListener('click', () => {
  contextMenu.classList.add('hidden');
});

contextMenu.querySelector('#context-delete').addEventListener('click', function (e) {
  e.stopPropagation();
  handleDeleteMessage(e, currentContextMessageId, false);
  contextMenu.classList.add('hidden');
});

// Edit option (placeholder)
contextMenu.querySelector('#context-edit').addEventListener('click', function (e) {
  e.stopPropagation();
  console.log('Edit message functionality not implemented yet.');
  contextMenu.classList.add('hidden');
});

// Seen receipt option (placeholder)
contextMenu.querySelector('#context-seen').addEventListener('click', function (e) {
  e.stopPropagation();
  console.log('Seen receipt functionality not implemented yet.');
  contextMenu.classList.add('hidden');
});
