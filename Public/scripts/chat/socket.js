const token = localStorage.getItem('qchat_token');
export const socket = io({
  auth: { token },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
