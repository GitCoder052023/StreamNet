const socket = io();

const chat = document.getElementById("chat");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

socket.on("chat-message", (data) => {
  const messageElement = document.createElement("div");
  messageElement.className = "flex items-start space-x-3 animate-fade-in";
  messageElement.innerHTML = `
    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold shadow-md">
      ${data.id.slice(0, 2)}
    </div>
    <div>
      <p class="text-sm text-gray-400 mb-1">User ${data.id}</p>
      <div class="bg-gray-700 p-3 rounded-lg max-w-md shadow-md">
        <p>${data.message}</p>
      </div>
      <p class="text-xs text-gray-500 mt-1">${new Date().toLocaleTimeString()}</p>
    </div>
  `;
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("user-connected", (id) => {
  const messageElement = document.createElement("div");
  messageElement.className = "text-center text-sm text-gray-400 animate-fade-in";
  messageElement.textContent = `User ${id} connected.`;
  chat.appendChild(messageElement);
});

socket.on("user-disconnected", (id) => {
  const messageElement = document.createElement("div");
  messageElement.className = "text-center text-sm text-gray-400 animate-fade-in";
  messageElement.textContent = `User ${id} disconnected.`;
  chat.appendChild(messageElement);
});

const sendMessage = () => {
  if (messageInput.value.trim()) {
    socket.emit("chat-message", messageInput.value.trim());
    messageInput.value = "";
  }
};

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

sendButton.addEventListener("click", sendMessage);