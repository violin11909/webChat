const Message = require('../models/Message')
const Room = require('../models/Room')

exports.saveMessage = async (roomId, content, type, senderId) => {
    try {

        if (!content || !type || !senderId || !roomId) {
            throw new Error('Missing required message data');
        }

        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        const savedMsg = await Message.create({ content, type, senderId, roomId });
        return savedMsg;

    } catch (err) {
        throw err;
    }
}