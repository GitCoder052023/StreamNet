import { usersListEl, chat } from './elements.js';
import { getColorClass, getInitial, scrollToBottom, createStatusMessage } from './helpers.js';

export let onlineUsers = new Map();

export function updateUsersList() {
  usersListEl.innerHTML = '';
  onlineUsers.forEach((user, userId) => {
    const userElement = document.createElement('div');
    userElement.className =
      'flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors';
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
    usersListEl.appendChild(userElement);
  });
}

export function handleUserConnected(data) {
  onlineUsers.set(data.userId, {
    username: data.username,
    avatar: getInitial(data.username),
    colorClass: getColorClass(data.userId)
  });
  updateUsersList();
  chat.appendChild(createStatusMessage(data.username, 'connected', data.timestamp));
  scrollToBottom();
}

export function handleUserDisconnected(data) {
  onlineUsers.delete(data.userId);
  updateUsersList();
  chat.appendChild(createStatusMessage(data.username, 'disconnected', data.timestamp));
  scrollToBottom();
}

export function updateUsersListFromUsers(users) {
  onlineUsers.clear();
  users.forEach((user) => {
    onlineUsers.set(user.userId, {
      username: user.username,
      avatar: getInitial(user.username),
      colorClass: getColorClass(user.userId),
      lastSeen: user.lastSeen
    });
  });
  updateUsersList();
}
