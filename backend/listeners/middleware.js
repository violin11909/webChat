const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
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
}

module.exports = { socketAuth }