const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { createRoom, saveContent, saveReactEmoji } = require("../controllers/room")


let io;
const onlineUsers = new Map();

let roomList
function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

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
            if (err.message === "User not found") {
                return next(new Error('Authentication error: User not found'));
            }
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🟢 User '${socket.data.user.name}' connected`);
        
        onlineUsers.set(socket.id, { 
            _id: socket.data.user._id, 
            name: socket.data.user.name, 
            profile: socket.data.user.profile 
        });
        io.emit('update-online-users', Array.from(onlineUsers.values()));

        socket.on('get-online-users', () => {
            socket.emit('online-users-list', Array.from(onlineUsers.values()));
        });

        [...socket.rooms].forEach(r => r !== socket.id && socket.leave(r));

        socket.on('send-message', async (data) => {
            try {
                const { roomId } = data

                const res = await saveContent(data);
                if (res) io.to(roomId).emit('receive-message', res); //populate เเล้ว

            } catch (err) {
                socket.emit('error-message', err.message);
            }

        });

        socket.on('send-emoji', async (data) => {
            try {
                const { roomId } = data
                console.log(socket.data.user.name, 'send emoji', data)
                const res = await saveReactEmoji(data);
                if (res) io.to(roomId).emit('receive-emoji', res); //populate เเล้ว
            } catch (err) {
                socket.emit('error-message', err.message);
            }

        });


        socket.on("join-room", async (roomId) => {
            console.log(socket.data.user.name, 'room: ', socket.rooms)
            console.log(socket.data.user.name, 'join room: ', roomId);
            if (!roomId) {
                socket.emit("error-message", "Room not found!");
                return;
            }
            socket.join(roomId);
            console.log(socket.data.user.name, 'room: ', socket.rooms)

        });

        socket.on("leave-room", async (roomId) => {
            console.log(socket.data.user.name, 'leave room: ', roomId)
            if (!roomId) {
                socket.emit("error-message", "Room not found!");
                return;
            }
            socket.leave(roomId);
            console.log(socket.data.user.name, 'room now: ', socket.rooms);

        });

        socket.on('create-room', async (data) => {
            try {

                const createdRoom = await createRoom(data);

                if (!createdRoom) {
                    socket.emit("error-message", "Failed to create room!");
                    return;
                }
                socket.emit("success-message", "Create room successful!");
                socket.emit("new-room", createdRoom);
                console.log('new room = ', createdRoom.name)
                // socket.join(createdRoom._id.toString());

            } catch (err) {
                socket.emit("error-message", err.message);
                return;
            }
        });

        


        socket.on('disconnect', () => {
            console.log(`🔴 User '${socket.data.user.name}' Disconnectd`);
            // Remove user from online list and broadcast
            onlineUsers.delete(socket.id);
            io.emit('update-online-users', Array.from(onlineUsers.values()));
        });
    });

    console.log("Socket.IO is working!");

    return io;
}


// socket.emit()	ส่งกลับไปเฉพาะ client ที่กำลังเชื่อมต่อกับ socket นี้
// io.emit()	ส่งถึงทุก client ทุกห้อง
// socket.broadcast.emit()	ส่งถึงทุก client ยกเว้นตัวเอง
// io.to(room).emit()	ส่งถึงเฉพาะ client ในห้องนั้น
// socket.to(room).emit()	ส่งถึงคนอื่นในห้อง ยกเว้นตัวเอง

module.exports = { initSocket, io };