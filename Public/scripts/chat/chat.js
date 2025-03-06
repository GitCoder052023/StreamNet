import { chat, messageInput, replyPreview } from './elements.js';
import { sanitizeMessage, getColorClass, getInitial, scrollToBottom, createStatusMessage } from './helpers.js';
import { socket } from './socket.js';
import { myEmail } from './profile.js';
import { onlineUsers } from './users.js';

let isEditing = false;
let editingMessageId = null;

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
  const currentUserEmail = myEmail || localStorage.getItem("LChat_email");
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

function enterEditMode(messageId) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  const messageContent = messageElement.querySelector('.bg-blue-500 p, .bg-gray-700 p');
  const originalText = messagesCache[messageId].content;

  isEditing = true;
  editingMessageId = messageId;

  messageContent.innerHTML = `
      <div class="edit-container">
          <textarea class="w-full bg-transparent border-none resize-none focus:outline-none text-white"
              rows="1">${originalText}</textarea>
          <div class="flex gap-2 mt-2">
              <button class="save-edit text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30 transition-colors">
                  Save
              </button>
              <button class="cancel-edit text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-colors">
                  Cancel
              </button>
          </div>
      </div>
  `;

  const textarea = messageContent.querySelector('textarea');
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });

  messageContent.querySelector('.save-edit').addEventListener('click', (e) => {
    e.stopPropagation();
    saveEdit(messageId, textarea.value);
  });

  messageContent.querySelector('.cancel-edit').addEventListener('click', (e) => {
    e.stopPropagation();
    cancelEdit(messageId);
  });
}

function saveEdit(messageId, newContent) {
  if (!newContent.trim()) return;

  const originalContent = messagesCache[messageId].content;
  if (newContent.trim() === originalContent.trim()) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    const messageContent = messageElement.querySelector('.bg-blue-500 p, .bg-gray-700 p');
    messageContent.textContent = originalContent;
    isEditing = false;
    editingMessageId = null;
    return;
  }

  socket.emit('edit-message', {
    messageId,
    newContent: newContent.trim()
  });
  isEditing = false;
  editingMessageId = null;
}


function cancelEdit(messageId) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  const messageContent = messageElement.querySelector('.bg-blue-500 p, .bg-gray-700 p');
  messageContent.textContent = messagesCache[messageId].content;
  isEditing = false;
  editingMessageId = null;
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

  const currentUserEmail = myEmail || localStorage.getItem("LChat_email");
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
  <div class="context-menu-container min-w-[180px] py-1">
    <div id="context-delete" class="context-option flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors duration-150 cursor-pointer group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 group-hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span class="text-red-400 group-hover:text-red-300 text-sm font-medium">Delete</span>
    </div>

    <div class="border-t border-gray-700/50 my-1"></div>

    <div id="context-edit" class="context-option flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 group-hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
      <span class="text-blue-400 group-hover:text-blue-300 text-sm font-medium">Edit</span>
    </div>

    <div class="border-t border-gray-700/50 my-1"></div>

    <div id="context-seen" class="context-option flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 group-hover:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span class="text-green-400 group-hover:text-green-300 text-sm font-medium">Seen</span>
    </div>
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

chat.addEventListener('contextmenu', function (e) {
  const messageContainer = e.target.closest('.message-container');
  if (!messageContainer) return;

  const senderId = messageContainer.dataset.senderId;
  const currentUserEmail = myEmail || localStorage.getItem("LChat_email");

  if (senderId === currentUserEmail) {
    e.preventDefault();
    showContextMenu(e, messageContainer.dataset.messageId);
  }
});

chat.addEventListener('touchstart', function (e) {
  const messageContainer = e.target.closest('.message-container');
  if (!messageContainer) return;

  const senderId = messageContainer.dataset.senderId;
  const currentUserEmail = myEmail || localStorage.getItem("LChat_email");

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

contextMenu.querySelector('#context-edit').addEventListener('click', function (e) {
  e.stopPropagation();
  if (!isEditing) {
    enterEditMode(currentContextMessageId);
  }
  contextMenu.classList.add('hidden');
});

// Seen receipt option (placeholder)
contextMenu.querySelector('#context-seen').addEventListener('click', function (e) {
  e.stopPropagation();
  console.log('Seen receipt functionality not implemented yet.');
  contextMenu.classList.add('hidden');
});

socket.on('message-edited', (data) => {
  const messageElement = document.querySelector(`[data-message-id="${data.messageId}"]`);
  if (messageElement) {
    const messageContent = messageElement.querySelector('.bg-blue-500 p, .bg-gray-700 p');
    messageContent.textContent = data.newContent;

    // Add edited indicator
    const timeElement = messageElement.querySelector('.text-gray-500');
    timeElement.textContent += ' (edited)';

    // Update cache
    messagesCache[data.messageId].content = data.newContent;
    messagesCache[data.messageId].edited = true;
    messagesCache[data.messageId].editedAt = data.editedAt;
  }
});
