export function initProfile(BACKEND_URL) {
    const profileIcon = document.getElementById('profile-icon');
    const profilePopup = document.getElementById('profile-popup');
    const profileInitials = document.getElementById('profile-initials');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'light';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);

        themeButtons.forEach(btn => {
            btn.classList.toggle('bg-blue-100', btn.dataset.theme === theme);
        });
    }

    applyTheme(savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                applyTheme(systemTheme);
            } else {
                applyTheme(theme);
            }
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    profileIcon.addEventListener('mouseenter', () => {
        profileIcon.style.transform = 'scale(1.1)';
        profileIcon.style.transition = 'transform 0.2s ease';
    });

    profileIcon.addEventListener('mouseleave', () => {
        profileIcon.style.transform = 'scale(1)';
    });

    const username = localStorage.getItem('username');
    if (username && profileInitials) {
        const trimmedName = getTrimmedName(username);
        profileInitials.textContent = getInitials(trimmedName);
        profileIcon.style.backgroundColor = stringToColor(username);
    }

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopup.classList.toggle('hidden');

        const popupUsername = document.getElementById('popup-username');
        const popupEmail = document.getElementById('popup-email');
        const storedUsername = localStorage.getItem('username');
        popupUsername.textContent = storedUsername ? getTrimmedName(storedUsername) : '';
        popupEmail.textContent = localStorage.getItem('email') || '';
    });

    document.addEventListener('click', (e) => {
        if (!profilePopup.contains(e.target) && !profileIcon.contains(e.target)) {
            profilePopup.classList.add('hidden');
        }
    });

    const popupLogout = document.getElementById('popup-logout');
    popupLogout.addEventListener('click', async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            window.location.href = '/login';
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/logout`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Logout failed.');
            }
        } catch (error) {
            console.error(error);
            alert('Error during logout.');
        }
    });
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
}

function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
}

export function getTrimmedName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length <= 2) return fullName;
    return `${nameParts[0]} ${nameParts[1]}`;
}