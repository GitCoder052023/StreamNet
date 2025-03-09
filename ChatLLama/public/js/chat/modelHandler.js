export async function initializeModelSelector(BACKEND_URL) {
    const modelDropdown = document.getElementById('model-dropdown');
    const chatInput = document.getElementById('chat-input');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/models`);
        const data = await response.json();
        
        if (data.success) {
            modelDropdown.innerHTML = data.models.map(model => 
                `<option value="${model.name}">${model.name}</option>`
            ).join('');
            
            chatInput.placeholder = `Ask ${modelDropdown.value}...`;
            
            modelDropdown.addEventListener('change', () => {
                chatInput.placeholder = `Ask ${modelDropdown.value}...`;
            });
        }
    } catch (error) {
        console.error('Error fetching models:', error);
        modelDropdown.innerHTML = '<option value="deepseek-r1:1.5b">deepseek-r1:1.5b</option>';
        chatInput.placeholder = 'Ask deepseek-r1:1.5b...';
    }
} 