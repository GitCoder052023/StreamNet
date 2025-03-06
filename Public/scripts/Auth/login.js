lucide.createIcons();

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');
    const errorDiv = document.getElementById('error-message') || createErrorElement(this);

    errorDiv.textContent = '';
    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Signing In...</span>`;

    try {
        const backendHost = document.querySelector('meta[name="backend-host"]').content;
        const response = await fetch(`https://${backendHost}:4000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('LChat_token', data.token);
        window.location.href = '/chat';
    } catch (error) {
        errorDiv.textContent = error.message;
        submitButton.innerHTML = `<span>Sign In</span><i data-lucide="log-in" class="w-5 h-5"></i>`;
    } finally {
        submitButton.disabled = false;
    }
});

function createErrorElement(form) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'text-red-600 text-sm mt-2 text-center';
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    return errorDiv;
}
