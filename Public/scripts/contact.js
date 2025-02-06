document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const message = document.getElementById('message').value.trim();
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        const token = localStorage.getItem('qchat_token');
        if (!token) {
            window.location.href = '/auth/login?redirect=/support/contact';
            return;
        }

        const backendHost = document.querySelector('meta[name="backend-host"]').content;
        const response = await fetch(`https://${backendHost}:4000/api/query/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Failed to submit query');
        }

        alert('Thank you for your message! We will get back to you soon');
        window.location.href = '/';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again later.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});
