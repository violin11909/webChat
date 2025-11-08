const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    // Group Name
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    member: {
        type: [mongoose.Schema.ObjectId],
        required: true,
        default: []
    },
    isPrivate: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Room', RoomSchema)