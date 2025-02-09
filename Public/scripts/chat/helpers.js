import { chat } from './elements.js';

export function sanitizeMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  return div.innerHTML;
}

export function getColorClass(userId) {
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

export function getInitial(username) {
  return username.charAt(0).toUpperCase();
}

export function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

export function createStatusMessage(username, action, timestamp) {
  const time = new Date(timestamp).toLocaleTimeString();
  const firstName = username.split(' ')[0];
  const messageElement = document.createElement('div');
  messageElement.className = 'text-center text-sm text-gray-400 my-2';
  messageElement.innerHTML = `
    <span class="bg-gray-700 px-3 py-1 rounded-full">
      ${firstName} ${action} • ${time}
    </span>
  `;
  return messageElement;
}
