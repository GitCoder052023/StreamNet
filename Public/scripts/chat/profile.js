import { profileName, profileEmail, profileAvatar, profilePopupAvatar, profileButton, profilePopup, logoutButton } from './elements.js';
import { socket } from './socket.js';
import { getColorClass, getInitial } from './helpers.js';

export let myEmail = null;

export async function initUserProfile() {
  const token = localStorage.getItem('qchat_token');
  try {
    const backendHost = document.querySelector('meta[name="backend-host"]').content;
    const response = await fetch(`https://${backendHost}:4000/api/auth/user-info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await response.json();
    myEmail = userData.email;
    profileName.textContent = userData.fullName;
    profileEmail.textContent = userData.email;
    updateAvatars(userData.email, userData.fullName);
    socket.emit('request-users-list');
    socket.emit('user-status-update', { userId: userData.email, status: 'online' });
  } catch (error) {
    console.error('Error initializing user profile:', error);
  }
}

export function updateAvatars(userId, fullName) {
  const colorClass = getColorClass(userId);
  const initial = getInitial(fullName);
  profileAvatar.className = `w-full h-full rounded-full flex items-center justify-center ${colorClass}`;
  profileAvatar.textContent = initial;
  profilePopupAvatar.className = `w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`;
  profilePopupAvatar.textContent = initial;
}

export function setupProfileEvents() {
  profileButton.addEventListener('click', () => {
    profilePopup.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!profileButton.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.classList.add('hidden');
    }
  });

  logoutButton.addEventListener('click', async () => {
    const token = localStorage.getItem('qchat_token');
    try {
      const backendHost =
        document.querySelector('meta[name="backend-host"]')?.content ||
        process.env.HOST ||
        window.location.hostname;
      const response = await fetch(`https://${backendHost}:4000/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
}
