const { createRoom } = require("../controllers/room");

const roomSocketHandler = (io, socket) => {
    // Join a room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User '${socket.data.user.name}' joined room '${roomId}'`);
    });
    // Leave a room
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User '${socket.data.user.name}' left room '${roomId}'`);
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
};

module.exports = { roomSocketHandler };

