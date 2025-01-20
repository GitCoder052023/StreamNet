const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = new Server(server);

const users = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  users.add(socket.id);

  io.emit("user-connected", socket.id);

  socket.on("chat-message", (message) => {
    io.emit("chat-message", { id: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    users.delete(socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});