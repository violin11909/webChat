const { saveContent, saveReactEmoji } = require("../controllers/room");

const chatSocketHandler = (io, socket) => {
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
};

module.exports = { chatSocketHandler };