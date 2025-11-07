const ChatMessage = require('../models/ChatMessage')

exports.saveMessageToDb = async (senderId, receiverId, message) => {
    try {
        if (!senderId || !receiverId || !message) {
            throw new Error('Missing required message data');
        }

        const savedMsg = await ChatMessage.create({ senderId, receiverId, message });
        return savedMsg;

    } catch (error) {
        throw new Error('Error sending message');

    }
}

//อาจเอาไปไว้ใน service เเทน