import { appendMessage } from './chat/messageRenderer.js';
import { initializeSocketEvents } from './chat/socketHandler.js';
import { initProfile, getTrimmedName } from './chat/profileHandler.js';
import { initializeModelSelector } from './chat/modelSelector.js';
import { initializeConversations } from './chat/conversationHandler.js';

const backendHost = document.querySelector('meta[name="backend-host"]').content;
const BACKEND_URL = `http://${backendHost}:5000`;
const socket = io(BACKEND_URL);

const username = localStorage.getItem('username');
if (!username) {
	window.location.href = '/login';
}

document.addEventListener('DOMContentLoaded', async () => {
	initProfile(BACKEND_URL);
	initializeModelSelector(BACKEND_URL);

	const chatWindow = document.getElementById('chat-window');

	chatWindow.appendChild(createGreetingContainer());

	const chatForm = document.getElementById('chat-form');
	const chatInput = document.getElementById('chat-input');
	const sendButton = chatForm.querySelector('button[type="submit"]');

	const conversationHandler = await initializeConversations(BACKEND_URL, appendMessage, socket);

	const streamHandler = initializeSocketEvents(
		socket,
		{ chatWindow, sendButton, chatInput },
		appendMessage
	);

	chatInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			chatForm.dispatchEvent(new Event('submit'));
		}
	});

	chatForm.addEventListener('submit', async (e) => {
		const greetingElem = document.getElementById('greeting-container');
		if (greetingElem) {
			greetingElem.classList.add('fade-out');
			setTimeout(() => {
				if (greetingElem.parentNode) {
					greetingElem.parentNode.removeChild(greetingElem);
				}
			}, 500);
		}

		e.preventDefault();
		if (streamHandler.isStreaming) {
			socket.emit('stop chat message');
			streamHandler.forceStop();
			return;
		}
		const message = chatInput.value.trim();
		if (!message) return;

		const selectedModelElem = document.getElementById('selected-model');
		const selectedModel = selectedModelElem ? selectedModelElem.textContent.trim() : 'deepseek-r1:1.5b';

		let conversationId = conversationHandler.getCurrentConversationId();
		if (!conversationId) {
			conversationId = await conversationHandler.createNewConversation(message);
		}

		appendMessage(message, 'user');
		socket.emit('chat message', {
			message,
			model: selectedModel,
			conversationId
		});
		chatInput.value = '';
	});

	document.getElementById('new-chat').addEventListener('click', () => {
		chatWindow.innerHTML = '';
		chatWindow.appendChild(createGreetingContainer());
	});

	const sidebar = document.getElementById('sidebar');
	const headerTitle = document.getElementById('header-title');

	headerTitle.addEventListener('click', (e) => {
		e.stopPropagation();
		if (window.innerWidth < 768) {
			if (sidebar.classList.contains('-translate-x-full')) {
				sidebar.classList.remove('-translate-x-full');
				sidebar.classList.add('translate-x-0');
			} else {
				sidebar.classList.remove('translate-x-0');
				sidebar.classList.add('-translate-x-full');
			}
		}
	});

	document.addEventListener('click', (e) => {
		if (window.innerWidth < 768) {
			if (!sidebar.contains(e.target) && !e.target.closest('#header-title')) {
				if (sidebar.classList.contains('translate-x-0')) {
					sidebar.classList.remove('translate-x-0');
					sidebar.classList.add('-translate-x-full');
				}
			}
		}
	});

	document.getElementById('new-chat').addEventListener('click', () => {
		chatWindow.innerHTML = '';
		chatWindow.appendChild(createGreetingContainer());
		socket.emit('reset_chat');
	});
});

function createGreetingContainer() {
	const username = localStorage.getItem('username');
	const trimmedName = getTrimmedName(username);

	const container = document.createElement('div');
	container.id = 'greeting-container';
	container.className = 'flex justify-center items-center my-8';
	container.style.transition = 'opacity 0.5s ease';

	const heading = document.createElement('h1');
	heading.className = 'text-4xl md:text-6xl font-google-sans font-bold';
	heading.style.background = 'linear-gradient(90deg, #4285f4, #ea4335)';
	heading.style.webkitBackgroundClip = 'text';
	heading.style.backgroundClip = 'text';
	heading.style.webkitTextFillColor = 'transparent';
	heading.style.textAlign = 'center';
	heading.innerHTML = `Hello, ${trimmedName}`;

	container.appendChild(heading);
	return container;
}
