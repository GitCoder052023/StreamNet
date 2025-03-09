const username = localStorage.getItem('username');
if (username) {
  window.location.href = '/chat';
}

const backendHost = document.querySelector('meta[name="backend-host"]').content;
const BACKEND_URL = `http://${backendHost}:5000`;

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('username', username);
      localStorage.setItem('email', data.email);
      window.location.href = '/chat';
    } else {
      document.getElementById('login-message').textContent = data.message || 'Login failed.';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('login-message').textContent = 'Error connecting to server.';
  }
});
