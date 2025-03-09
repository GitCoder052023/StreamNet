export async function initializeConversations(BACKEND_URL, appendMessageCallback, socket) {
  const sidebar = document.querySelector('#sidebar .flex-1');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  let currentConversationId = null;

  socket.on('conversation_updated', (data) => {
    const conversationElem = sidebar.querySelector(`[data-id="${data.id}"]`);
    if (conversationElem) {
      const titleElem = conversationElem.querySelector('.text-sm');
      titleElem.textContent = data.title;
      updateNewChatButtonState()
    }
  });

  async function deleteConversation(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        if (currentConversationId === id) {
          currentConversationId = null;
          const chatWindow = document.getElementById('chat-window');
          chatWindow.innerHTML = '';
          chatWindow.appendChild(createGreetingContainer());
          window.history.pushState({}, '', '/chat');
        }
        await loadConversations();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  async function loadConversations() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/conversations/user/${email}`);
      const data = await response.json();
      
      if (data.success) {
        sidebar.innerHTML = data.conversations.map(conv => `
            <div class="conversation-item p-3 cursor-pointer rounded-lg mb-2 transition-colors relative group"
                 data-id="${conv._id}">
              <div class="text-sm font-medium text-gray-800 truncate pr-8">${conv.title || 'New Chat'}</div>
              <div class="text-xs text-gray-500">${new Date(conv.lastUpdated).toLocaleDateString()}</div>
              <button class="delete-conversation absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-700">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          `).join('');

        attachConversationListeners();
        updateNewChatButtonState()
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  async function createNewConversation(firstMessage = null) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          email,
          title: firstMessage ? firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '') : 'New Chat'
        })
      });
      const data = await response.json();
      
      if (data.success) {
        currentConversationId = data.conversationId;
        await loadConversations();
        updateNewChatButtonState()
        return currentConversationId;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }

  async function loadConversation(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/conversations/detail/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';
        
        data.conversation.messages.forEach(msg => {
          appendMessageCallback(msg.content, msg.role === 'user' ? 'user' : 'bot', msg.modelName);
        });

        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  function attachConversationListeners() {
    document.querySelectorAll('.conversation-item').forEach(item => {
      const deleteBtn = item.querySelector('.delete-conversation');
      const convId = item.dataset.id;

      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this conversation?')) {
          await deleteConversation(convId);
        }
      });

      item.addEventListener('click', async (e) => {
        if (!e.target.closest('.delete-conversation')) {
          currentConversationId = convId;
          await loadConversation(currentConversationId);
          window.history.pushState({}, '', `/chat/${currentConversationId}`);
        }
      });
    });
  }

  await loadConversations();

  document.getElementById('new-chat').addEventListener('click', async () => {
    currentConversationId = await createNewConversation();
    window.history.pushState({}, '', `/chat/${currentConversationId}`);
  });

  function updateNewChatButtonState() {
    const newChatExists = Array.from(document.querySelectorAll('.conversation-item'))
      .some(item => item.querySelector('.text-sm').textContent === 'New Chat');
    
    const newChatButton = document.getElementById('new-chat');
    if (newChatExists) {
      newChatButton.disabled = true;
      newChatButton.classList.remove('cursor-pointer')
      newChatButton.classList.add('opacity-50');
      newChatButton.title = 'Please start a conversation in the current New Chat first';
    } else {
      newChatButton.disabled = false;
      newChatButton.classList.remove('opacity-50');
      newChatButton.removeAttribute('title');
    }
  }

  return {
    getCurrentConversationId: () => currentConversationId,
    createNewConversation,
    loadConversations
  };
} 