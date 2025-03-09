const backendHost = document.querySelector('meta[name="backend-host"]').content;
const BACKEND_URL = `http://${backendHost}:5000`;

const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');

const passwordRequirements = {
  length: (pw) => pw.length >= 8,
  uppercase: (pw) => /[A-Z]/.test(pw),
  lowercase: (pw) => /[a-z]/.test(pw),
  digit: (pw) => /[0-9]/.test(pw),
  special: (pw) => /[!@#$%^&*]/.test(pw)
};

function updatePasswordRequirementsDisplay(password) {
  const requirementsElems = document.querySelectorAll('#password-requirements .requirement');
  requirementsElems.forEach((elem) => {
    const rule = elem.getAttribute('data-rule');
    if (passwordRequirements[rule](password)) {
      elem.style.color = 'green';
    } else {
      elem.style.color = 'grey';
    }
  });
}

passwordInput.addEventListener('input', (e) => {
  updatePasswordRequirementsDisplay(e.target.value);
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupMessage.textContent = '';

  const username = document.getElementById('username').value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Email validation: must end with '@gmail.com'
  if (!email.endsWith('@gmail.com')) {
    signupMessage.textContent = 'Email must end with @gmail.com.';
    return;
  }

  // Password validation using the defined rules
  const passwordValid = Object.values(passwordRequirements).every((test) => test(password));
  if (!passwordValid) {
    signupMessage.textContent = 'Password does not meet all requirements.';
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = '/login';
    } else {
      signupMessage.textContent = data.message || 'Signup failed.';
    }
  } catch (error) {
    console.error(error);
    signupMessage.textContent = 'Error connecting to server.';
  }
});
