const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    // Group Name
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isPrivate: {
        type: Boolean,
        required: true
    },
    profile: {
        type: String,
        default: "somepicture"
    },
    lastContent: {
        type: mongoose.Schema.ObjectId,
        ref: "Message"
    },

})

module.exports = mongoose.model('Room', RoomSchema)