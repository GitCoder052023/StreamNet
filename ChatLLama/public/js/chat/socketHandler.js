export function initializeSocketEvents(socket, { chatWindow, sendButton, chatInput }, appendMessage) {
    let currentResponse = '';
    let currentTypingElem = null;
    let streaming = false;
    let currentModel = null;
    let scrollInterval = null;

    function smoothScrollToBottom() {
        const isAtBottom = chatWindow.scrollHeight - chatWindow.clientHeight <= chatWindow.scrollTop + 100;
        if (isAtBottom) {
            chatWindow.scrollTo({ 
                top: chatWindow.scrollHeight, 
                behavior: 'smooth' 
            });
        }
    }

    socket.on('chat response', (data) => {
        const chunk = data.chunk;
        if (chunk === '[STREAM_START]') {
            currentResponse = '';
            currentModel = data.model || '';
            currentTypingElem = createTypingIndicator();
            chatWindow.appendChild(currentTypingElem);
            chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
            streaming = true;
            sendButton.innerHTML = '<i class="fas fa-stop text-lg"></i>';
            chatInput.required = false;
            
            scrollInterval = setInterval(smoothScrollToBottom, 100);
            
        } else if (chunk === '[STREAM_END]') {
            if (currentTypingElem) {
                chatWindow.removeChild(currentTypingElem);
                currentTypingElem = null;
            }
            appendMessage(currentResponse, 'bot', currentModel);
            currentResponse = '';
            currentModel = null;
            streaming = false;
            sendButton.innerHTML = '<i class="fas fa-paper-plane text-lg"></i>';
            chatInput.required = true;
            
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            
            setTimeout(() => {
                chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
            }, 100);
            
        } else {
            currentResponse += chunk;
            if (currentTypingElem) {
                const bubble = currentTypingElem.querySelector('.max-w-2xl');
                bubble.innerHTML = marked.parse(currentResponse);
            } else {
                appendMessage(chunk, 'bot', currentModel);
            }
        }
    });

    function createTypingIndicator() {
        const container = document.createElement('div');
        container.className = 'message-container flex flex-col w-full mb-4';

        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex justify-start';

        const bubble = document.createElement('div');
        bubble.className = 'max-w-2xl p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md';
        bubble.innerHTML = `<div class="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>`;

        messageWrapper.appendChild(bubble);
        container.appendChild(messageWrapper);
        return container;
    }

    function forceStop() {
        if (currentTypingElem) {
            chatWindow.removeChild(currentTypingElem);
            currentTypingElem = null;
        }
        currentResponse = '';
        streaming = false;
        sendButton.innerHTML = '<i class="fas fa-paper-plane text-lg"></i>';
        chatInput.required = true;
    }

    return {
        get isStreaming() {
            return streaming;
        },
        forceStop
    };
}