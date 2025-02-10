import { chat, messageInput, replyPreview } from './elements.js';
import { sanitizeMessage, getColorClass, getInitial, scrollToBottom, createStatusMessage } from './helpers.js';
import { socket } from './socket.js';
import { myEmail } from './profile.js';
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
  if (isMyMessage) {
    return `
      <div class="flex-grow"></div>
      <div class="sent-message-container flex items-start gap-3">
        <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md sent-avatar">
          ${getInitial(data.username)}
        </div>
        <div class="text-left max-w-md">
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
        <div class="w-10 h-10 ${getColorClass(data.id)} rounded-full flex items-center justify-center font-bold shadow-md">
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
  const isMyMessage = myEmail && data.id === myEmail;
  const messageElement = document.createElement('div');
  messageElement.dataset.senderId = data.id;
  messageElement.className = `message-container flex items-start gap-3 mb-4 ${isMyMessage ? 'justify-end' : ''}`;
  messageElement.addEventListener('click', () => handleMessageClick(data.messageId));
  const replyPreviewHTML = data.replyTo ? generateReplyPreview(messagesCache[data.replyTo], data.id) : '';
  const time = new Date(data.timestamp).toLocaleTimeString();
  messageElement.innerHTML = generateMessageHTML(data, isMyMessage, replyPreviewHTML, time);
  return messageElement;
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
