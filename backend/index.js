import { Server as WebSocketServer } from "socket.io";
import http from "http";
import Sockets from "./sockets.js";
import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT, FRONTEND_URL } from "./config.js";
import "./libs/initialSetup.js";

connectDB();
const server = http.createServer(app);
const httpServer = server.listen(PORT);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log("Server on http://localhost:", PORT);

const io = new WebSocketServer(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });
Sockets(io);


