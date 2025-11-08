const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add a content']
    },
    type: {
        type: String,
        enum: ["text", "image", "stickers", "emoji"],
        required: true,
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    // same field as user 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', MessageSchema)
