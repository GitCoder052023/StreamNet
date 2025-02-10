import { profileName, profileEmail, profileAvatar, profilePopupAvatar, profileButton, profilePopup, logoutButton } from './elements.js';
import { socket } from './socket.js';
import { getColorClass, getInitial } from './helpers.js';
import { onlineUsers, updateUsersList } from './users.js';

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

    const storedColor = localStorage.getItem("avatarColorPreference");
    if (storedColor) {
      socket.emit('update-avatar-color', { userId: userData.email, colorClass: storedColor });
    }

    updateAvatars(userData.email, userData.fullName);
    socket.emit('request-users-list');
    socket.emit('user-status-update', { userId: userData.email, status: 'online' });
  } catch (error) {
    console.error('Error initializing user profile:', error);
  }
}

export function updateAvatars(userId, fullName) {
  let colorClass = getColorClass(userId);
  const storedColor = localStorage.getItem("avatarColorPreference");
  if (storedColor) {
    colorClass = storedColor;
  }
  const initial = getInitial(fullName);
  profileAvatar.className = `w-full h-full rounded-full flex items-center justify-center ${colorClass}`;
  profileAvatar.textContent = initial;
  profilePopupAvatar.className = `w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`;
  profilePopupAvatar.textContent = initial;
}

export function setupProfileEvents() {
  if (window.innerWidth >= 768) {
    profileButton.addEventListener('mouseenter', showProfilePopup);
    profilePopup.addEventListener('mouseenter', showProfilePopup);
    profileButton.addEventListener('mouseleave', hideProfilePopupWithDelay);
    profilePopup.addEventListener('mouseleave', hideProfilePopup);
  } else {
    profileButton.addEventListener('click', () => {
      profilePopup.classList.toggle('visible');
    });
  }

  logoutButton.addEventListener('click', async () => {
    const confirmed = window.confirm("Are you sure that you want to logout?");
    if (!confirmed) return;
    localStorage.removeItem("avatarColorPreference");

    const token = localStorage.getItem('qchat_token');
    try {
      const backendHost =
        document.querySelector('meta[name="backend-host"]')?.content ||
        window.location.hostname;
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

  const avatarColorChoices = document.querySelectorAll('.avatar-color-choice');
  avatarColorChoices.forEach(choice => {
    choice.addEventListener('click', function () {
      const colorClass = this.getAttribute('data-color');
      localStorage.setItem('avatarColorPreference', colorClass);

      updateAvatars(myEmail, profileName.textContent);

      if (myEmail && onlineUsers.has(myEmail)) {
        const currentUser = onlineUsers.get(myEmail);
        currentUser.colorClass = colorClass;
        onlineUsers.set(myEmail, currentUser);
      }
      updateUsersList();

      socket.emit('update-avatar-color', {
        userId: myEmail,
        colorClass,
        username: profileName.textContent
      });

      socket.disconnect().connect();
    });
  });

  document.addEventListener('click', function (e) {
    if (!profileButton.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.classList.remove('visible');
    }
  });
}

function showProfilePopup() {
  profilePopup.classList.add('visible');
}
function hideProfilePopup() {
  profilePopup.classList.remove('visible');
}
function hideProfilePopupWithDelay() {
  setTimeout(() => {
    if (!profilePopup.matches(':hover')) {
      hideProfilePopup();
    }
  }, 100);
}
