lucide.createIcons();

const inputs = document.querySelectorAll('input[type="text"]');
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && !e.target.value) {
            inputs[index - 1].focus();
        }
    });
});

const formData = JSON.parse(sessionStorage.getItem('pendingSignup'));
if (formData && formData.email) {
    document.getElementById('email-display').textContent = formData.email;
}

document.getElementById('resetForm2').addEventListener('submit', async function (e) {
    e.preventDefault();

    const otp = Array.from(document.querySelectorAll('input[type="text"]'))
        .map(input => input.value)
        .join('');

    const purpose = new URLSearchParams(window.location.search).get('purpose');
    const formData = JSON.parse(sessionStorage.getItem('pendingSignup'));

    try {
        const backendHost = document.querySelector('meta[name="backend-host"]').content;

        const response = await fetch(`https://${backendHost}:4000/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                otp,
                purpose
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Invalid OTP');
        }

        if (purpose === 'signup') {
            const signupResponse = await fetch(`https://${backendHost}:4000/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await signupResponse.json();
            localStorage.setItem('StreamNet_token', data.token);
            sessionStorage.removeItem('pendingSignup');
            window.location.href = '/chat';
        }
    } catch (error) {
        alert(error.message);
        console.error('Error:', error);
    }
});
