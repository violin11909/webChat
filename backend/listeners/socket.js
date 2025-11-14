const { Server } = require("socket.io");
const { roomSocketHandler } = require("./room");
const { chatSocketHandler } = require("./chat");
const { userSocketHandler } = require("./user");
const { socketAuth } = require("./middleware");

let io;
const onlineUsers = new Map();
const userIdToSocketIdMap = new Map();

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });
    // Middleware for authentication
    io.use(socketAuth);
    // Main connection handler
    io.on('connection', (socket) => {
        userSocketHandler(io, socket, onlineUsers, userIdToSocketIdMap);
        chatSocketHandler(io, socket);
        roomSocketHandler(io, socket, userIdToSocketIdMap);
    });
    console.log("Socket.IO is working!");
    return io;
}

module.exports = { initSocket, io };
