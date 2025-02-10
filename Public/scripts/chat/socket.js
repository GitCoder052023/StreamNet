const token = localStorage.getItem('qchat_token');
const colorPreference = localStorage.getItem('avatarColorPreference');

export const socket = io({
  auth: {
    token,
    colorPreference
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
