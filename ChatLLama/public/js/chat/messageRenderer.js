export function appendMessage(html, sender = 'bot', modelName = '') {
    const chatWindow = document.getElementById('chat-window');
    const container = document.createElement('div');
    container.className = 'message-container flex flex-col w-full mb-4';

    const thinkRegex = /<think>(.*?)<\/think>/gs;
    let thinkContent = '';
    let processedHtml = html;
    let match;

    while ((match = thinkRegex.exec(html))) {
        thinkContent += match[1] + ' '; 
        processedHtml = processedHtml.replace(match[0], '');
    }

    const messageWrapper = document.createElement('div');
    messageWrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-2xl p-4 rounded-2xl ${
        sender === 'user'
            ? 'bg-[#e8eef6] text-black rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
    }`;

    bubble.innerHTML = marked.parse(processedHtml);

    if (thinkContent && sender === 'bot') {
        const thinkContainer = document.createElement('div');
        thinkContainer.className = 'think-container mt-2';

        const toggle = document.createElement('div');
        toggle.className = 'think-toggle flex items-center gap-1 text-gray-500 text-sm cursor-pointer hover:text-gray-700';
        toggle.innerHTML = `
            <svg class="toggle-arrow w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6"/>
            </svg>
            <span>Show reasoning</span>
        `;

        const content = document.createElement('div');
        content.className = 'think-content hidden mt-1 text-gray-500 text-sm whitespace-pre-line';
        content.innerHTML = marked.parse(thinkContent.trim()); 

        let isExpanded = false;
        toggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            content.classList.toggle('hidden');
            toggle.querySelector('.toggle-arrow').style.transform =
                isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            toggle.querySelector('span').textContent =
                isExpanded ? 'Hide reasoning' : 'Show reasoning';
        });

        thinkContainer.appendChild(toggle);
        thinkContainer.appendChild(content);
        bubble.appendChild(thinkContainer);
    }

    messageWrapper.appendChild(bubble);
    container.appendChild(messageWrapper);

    if (sender === 'bot' && modelName) {
        const modelLabel = document.createElement('div');
        modelLabel.className = 'text-xs text-gray-500 mt-1 ml-2';
        modelLabel.textContent = modelName;
        container.appendChild(modelLabel);
    }

    chatWindow.appendChild(container);

    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}
