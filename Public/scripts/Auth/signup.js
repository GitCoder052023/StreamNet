document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const submitButton = this.querySelector('button[type="submit"]');
    const errorDiv = document.getElementById('error-message') || createErrorElement(this);

    errorDiv.textContent = '';
    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Creating Account...</span>`;

    try {
        const backendHost = document.querySelector('meta[name="backend-host"]').content;

        const otpResponse = await fetch(`https://${backendHost}:4000/api/auth/send-signup-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
        });

        if (!otpResponse.ok) {
            throw new Error('Failed to send OTP');
        }

        sessionStorage.setItem('pendingSignup', JSON.stringify(formData));

        window.location.href = '/auth/verify-otp?purpose=signup';

    } catch (error) {
        errorDiv.textContent = error.message;
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
