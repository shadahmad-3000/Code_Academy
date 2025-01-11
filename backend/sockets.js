export default (io) => {
  global.onlineUsers = new Map(); // { userId: { socketId: socket.id, ...otherData } }
  global.typingUsers = new Map(); // { chatId: Set(userId) }

  io.on("connection", (socket) => {
    console.log('New client connected, socket id:', socket.id);

    socket.on("add-user", (userId) => {
      console.log('User added:', userId);
      global.onlineUsers.set(userId, { socketId: socket.id });
      io.emit("user-online", { userId, onlineUsers: Array.from(global.onlineUsers.keys()) });
      console.log('Current online users:', Array.from(global.onlineUsers.entries()));
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("send-msg", (data) => {
      console.log('Message sent:', data);
      io.to(data.chatId).emit("msg-recieve", data);
    });

    socket.on("typing", ({ userId, chatId }) => {
      if (!global.typingUsers.has(chatId)) {
        global.typingUsers.set(chatId, new Set());
      }
      global.typingUsers.get(chatId).add(userId);
      io.to(chatId).emit("typing", { userId, chatId, typingUsers: Array.from(global.typingUsers.get(chatId)) });
    });

    socket.on("stop-typing", ({ userId, chatId }) => {
      if (global.typingUsers.has(chatId)) {
        global.typingUsers.get(chatId).delete(userId);
        if (global.typingUsers.get(chatId).size === 0) {
          global.typingUsers.delete(chatId);
        } else {
          io.to(chatId).emit("stop-typing", { userId, chatId, typingUsers: Array.from(global.typingUsers.get(chatId)) });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log('Client disconnected, socket id:', socket.id);
      let userIdToRemove = null;
      for (const [userId, userData] of global.onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          userIdToRemove = userId;
          break;
        }
      }
      if (userIdToRemove) {
        global.onlineUsers.delete(userIdToRemove);
        io.emit("user-offline", { userId: userIdToRemove, onlineUsers: Array.from(global.onlineUsers.keys()) });
        global.typingUsers.forEach((users, chatId) => {
          users.delete(userIdToRemove);
          if (users.size === 0) {
            global.typingUsers.delete(chatId);
          } else {
            io.to(chatId).emit("stop-typing", { userId: userIdToRemove, chatId, typingUsers: Array.from(global.typingUsers.get(chatId)) });
          }
        });
      }
      console.log('Current online users:', Array.from(global.onlineUsers.entries()));
    });
  });
}