const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { saveMessage } = require("../controllers/message")
const { createRoom } = require("../controllers/room")


let io;

function initSocket(server) {
    io = new Server(server, {
        // cors: {
        //     origin: "http://localhost:3000",
        //     methods: ["GET", "POST"]
        // }
    });

    io.use(async (socket, next) => {
        // const token = socket.handshake.auth.token;

        // const socket = io('http://localhost:5000', {
        //     auth: {
        //         token: token
        //     }
        // }); --> ส่งจาก frontend
        const token = socket.handshake.query.token;//for test only

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id)
            if (!user) {
                throw new Error("User not found");
            }
            
            socket.data.userId = decoded.id;

            next();
        } catch (err) {
            if (err.message === "User not found") {
                return next(new Error('Authentication error: User not found'));
            }
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        // console.log(`User connected: ${socket.id}`);

        socket.on('send-message', async (data) => {
            try {
                const senderId = socket.data.userId;
                const { roomId, content, type } = data;
                const savedMessage = await saveMessage(roomId, content, type, senderId);

                if (!savedMessage) {
                    socket.emit("error-message", "Failed to send message!");
                    return;
                }
                io.to(roomId).emit('receive-message', savedMessage);
                // const sendFriendMessage = () => {
                //     const messageData = {
                //         senderId: Id
                //         receiverId: Id,
                //         message: "project ไร เยอะนักหนาวะ"
                //     };
                //     socket.emit('send-message-to-friend', messageData);
                // };--> frontend

            } catch (err) {
                socket.emit('error-message', err.message);
                return;
            }

        });

        socket.on("join-room", async (roomId) => {
            if (!roomId) {
                socket.emit("error-message", "Room not found!");
                return;
            }
            socket.join(roomId);
        });

        socket.on('create-room', async (data) => {
            try {
                const { name, isPrivate, friendId } = data;

                if (!name || !isPrivate) {
                    socket.emit("error-message", "Missing required room data!");
                    return;
                }
                if (isPrivate) {
                    if (!friendId) {
                        socket.emit("error-message", "Friend not found!");
                        return;
                    }
                }
                const member = isPrivate ? [socket.data.userId, friendId] : [socket.data.userId];
                const createdRoom = await createRoom(name, isPrivate, member);

                if (!createdRoom) {
                    socket.emit("error-message", "Failed to create room!");
                    return;
                }
                socket.emit("success-message", "Create room successful!");
                socket.join(createdRoom._id.toString());


            } catch (err) {
                socket.emit("error-message", err.message);
                return;
            }
        });


        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
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