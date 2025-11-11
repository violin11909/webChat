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
        default:"https://i.postimg.cc/yNpXxvMJ/user.png"
    },
    lastContent: {
        type: mongoose.Schema.ObjectId,
        ref: "Message"
    },
    searchKey:{
        type: String
    }

})

module.exports = mongoose.model('Room', RoomSchema)