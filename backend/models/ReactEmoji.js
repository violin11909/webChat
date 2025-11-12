const mongoose = require('mongoose')

const ReactEmojiSchema = new mongoose.Schema({
    reacterId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    messageId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('ReactEmoji', ReactEmojiSchema)
