const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookie = require('cookie'); 

const socketAuth = async (socket, next) => {
    let token;

    try {
        const cookieString = socket.handshake.headers.cookie;
        if (!cookieString) {
            return next(new Error('Authentication error: No cookies provided'));
        }

        const cookies = cookie.parse(cookieString);
        token = cookies.token; 

        if (!token) {
            return next(new Error('Authentication error: No token cookie provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new Error("User not found");
        }
        socket.data.user = user; 
        next();
    } catch (err) {
        console.error("Socket Auth Error:", err.message); 
        return next(new Error('Authentication error: Invalid token'));
    }
}

module.exports = { socketAuth }