const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createRoom, saveContent, saveReactEmoji } = require("../controllers/room");

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
    io.use(async (socket, next) => {
        let token;
        if (socket.handshake.auth.token) token = socket.handshake.auth.token;
        else if (socket.handshake.query.token) token = socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                throw new Error("User not found");
            }
            socket.data.user = user;
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    // Main connection handler
    io.on('connection', (socket) => {
        console.log(`🟢 User '${socket.data.user.name}' connected`);

        // Add user to online lists and broadcast
        const userInfo = {
            _id: socket.data.user._id,
            name: socket.data.user.name,
            profile: socket.data.user.profile
        };
        onlineUsers.set(socket.id, userInfo);
        userIdToSocketIdMap.set(socket.data.user._id.toString(), socket.id);
        io.emit('update-online-users', Array.from(onlineUsers.values()));

        // Add a listener for clients to request the online user list
        socket.on('get-online-users', () => {
            socket.emit('update-online-users', Array.from(onlineUsers.values()));
        });

        // Clean up any previous room connections
        [...socket.rooms].forEach(r => r !== socket.id && socket.leave(r));

        // --- Event Listeners ---

        socket.on('send-message', async (data) => {
            try {
                const { roomId } = data;
                const res = await saveContent(data);
                if (res) io.to(roomId).emit('receive-message', res);
            } catch (err) {
                socket.emit('error-message', err.message);
            }
        });

        socket.on('send-emoji', async (data) => {
            try {
                const { roomId } = data;
                const res = await saveReactEmoji(data);
                if (res) io.to(roomId).emit('receive-emoji', res);
            } catch (err) {
                socket.emit('error-message', err.message);
            }
        });

        socket.on("join-room", async (roomId) => {
            if (!roomId) return socket.emit("error-message", "Room not found!");
            socket.join(roomId);
        });

        socket.on("leave-room", async (roomId) => {
            if (!roomId) return socket.emit("error-message", "Room not found!");
            socket.leave(roomId);
        });

        socket.on('create-room', async (data) => {
            try {
                const createdRoom = await createRoom(data);
                if (!createdRoom) return socket.emit("error-message", "Failed to create room!");

                // Notify members of the new room
                if (createdRoom.isPrivate) {
                    // For private rooms, only notify the members
                    createdRoom.member.forEach(member => {
                        const memberSocketId = userIdToSocketIdMap.get(member._id.toString());
                        if (memberSocketId) {
                            io.to(memberSocketId).emit("new-room", createdRoom);
                        }
                    });
                } else {
                    // For public groups, notify all clients
                    io.emit("new-room", createdRoom);
                }
            } catch (err) {
                socket.emit("error-message", err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔴 User '${socket.data.user.name}' Disconnected`);
            // Remove user from maps and broadcast
            userIdToSocketIdMap.delete(socket.data.user._id.toString());
            onlineUsers.delete(socket.id);
            io.emit('update-online-users', Array.from(onlineUsers.values()));
        });
    });

    console.log("Socket.IO is working!");
    return io;
}

module.exports = { initSocket, io };
