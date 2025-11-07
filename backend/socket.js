const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')
const { saveMessageToDb } = require("./controllers/chat")


let io;

function initSocket(server) {
    io = new Server(server, {
        // cors: {
        //     origin: "http://localhost:3000",
        //     methods: ["GET", "POST"]
        // }
    });

    io.use((socket, next) => {
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
            socket.data.userId = decoded.id;
            console.log("user Id: ", decoded.id);

            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('send-message-to-friend', async (data) => {
            try {
                const senderId = socket.data.userId;
                const { receiverId, message } = data;

                const savedMessage = await saveMessageToDb(senderId, receiverId, message);
                socket.emit('receive_message', savedMessage); //for test
                io.to(senderId).to(receiverId).emit('receive_message', savedMessage);//--> ใช้ไม่ได้เพราะ receiverId ไม่มีจริง (test)
                // const sendFriendMessage = () => {
                //     const messageData = {
                //         senderId: Id
                //         receiverId: Id,
                //         message: "project ไร เยอะนักหนาวะ"
                //     };
                //     socket.emit('send-message-to-friend', messageData);
                // };--> frontend

            } catch (err) {
                console.error(err);
                socket.emit('error_message', 'Failed to send message');
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