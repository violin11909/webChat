const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            // type: mongoose.Schema.ObjectId,
            // ref: 'User',
            type: String, //for test
            required: true
        },

        message: {
            type: String,
            required: true
        },

        // (Optional) เก็บว่าใครอ่านแล้วบ้าง
        isRead: {
             type: Boolean,
             default: false
        }
            
               
            
    },
    { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);