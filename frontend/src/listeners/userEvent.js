import { socket } from './socketClient';


export const sendContent = (roomId, content, type, senderId, createdAt) => {
    if (!socket.connected) {
        console.error("Not connected to server!");
        return;
    }

    const messageData = { roomId: roomId, content: content, type: type, senderId: senderId, createdAt: createdAt };
    socket.emit("send-message", messageData);
}

