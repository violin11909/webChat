const userSocketHandler = (io, socket, onlineUsers, userIdToSocketIdMap) => {
    console.log(`🟢 User '${socket.data.user.name}' connected`);
    const userInfo = {
        _id: socket.data.user._id,
        name: socket.data.user.name,
        profile: socket.data.user.profile
    };
    onlineUsers.set(socket.id, userInfo);
    userIdToSocketIdMap.set(socket.data.user._id.toString(), socket.id);
    io.emit('update-online-users', Array.from(onlineUsers.values()));

    socket.on('get-online-users', () => {
        socket.emit('update-online-users', Array.from(onlineUsers.values()));
    });

    [...socket.rooms].forEach(r => r !== socket.id && socket.leave(r));
    socket.on('disconnect', () => {
        console.log(`🔴 User '${socket.data.user.name}' Disconnected`);
        // Remove user from maps and broadcast
        userIdToSocketIdMap.delete(socket.data.user._id.toString());
        onlineUsers.delete(socket.id);
        io.emit('update-online-users', Array.from(onlineUsers.values()));
    });
};

module.exports = { userSocketHandler };