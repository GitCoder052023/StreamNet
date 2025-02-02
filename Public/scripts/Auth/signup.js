document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');
    const errorDiv = document.getElementById('error-message') || createErrorElement(this);

    errorDiv.textContent = '';
    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Creating Account...</span>`;

    try {
        const backendHost = document.querySelector('meta[name="backend-host"]').content;
        const response = await fetch(`https://${backendHost}:4000/api/auth/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': `https://${backendHost}:3000`
            },
            body: JSON.stringify({ fullName: fullname, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('qchat_token', data.token);
        window.location.href = '/chat';
    } catch (error) {
        errorDiv.textContent = error.message;
        submitButton.innerHTML = `<span>Create Account</span><i data-lucide="arrow-right" class="w-5 h-5"></i>`;
        lucide.createIcons();
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