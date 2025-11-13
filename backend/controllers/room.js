const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Message')
const ReactEmoji = require('../models/ReactEmoji')


exports.getRooms = async (req, res) => {
    try {

        const rooms = await Room.find().populate("member", "profile name");
        return res.status(200).json({ success: true, msg: 'Get rooms successfully', data: rooms })

    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Error fetching room' })

    }
}
//  @desc    Create Room
//  @route   POST /api/v1/room
//  @access  Private
/*
    for more details in future about create room
    first everyone see every users in private filter but there no room yet
    if they click it will create private room between 2 users only and redirect to that room
    (frontend) room name will not display it will display only other user's profile and name
    for group room, there will be create room button, click it will pop up modal to input room name and select members
*/
// exports.createRoom = async (req, res) => {
//     try {
//         const { name, isPrivate, member } = req.body;
//         if (!name || !member || typeof isPrivate !== "boolean") {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
//         }

//         if (isPrivate) {
//             const friend = await User.findById(member[1])
//             if (!friend) {
//                 return res.status(404).json({ success: false, message: 'User not found' });
//             }
//         }

//         const newRoom = await Room.create({ name, member, isPrivate });
//         // 2. สั่ง populate บน document ที่สร้างเสร็จแล้ว และรอจน populate เสร็จ
//         const savedRoom = await newRoom.populate('member', 'profile name'); console.log(savedRoom)
//         return res.status(201).json({ success: true, message: 'Room created successfully', data: savedRoom });
//     } catch (err) {
//         console.error('Error creating room:', err.message);
//         return res.status(500).json({ success: false, message: 'Server error' });
//     }
// }

exports.updateRoomProfile = async (req, res) => {
    try {
        const { filePath, roomId } = req.body;
        console.log(filePath, roomId)
        if (!filePath) {
            return res.status(404).json({ message: 'Missing file path' });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { profile: filePath }, { new: true, runValidators: true })
        return res.status(200).json({ message: "Profile updated successfully", data: updatedRoom });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.getContentsByRoomId = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const content = await Message.find({ roomId: roomId }).sort({ createdAt: 1 }).populate([
            { path: 'senderId', select: 'profile name' },
            { path: 'reactEmoji', select: 'emoji', populate: { path: 'reacterId', select: 'profile name' } }
        ]);
        // const populateContent = await  content.populate('senderId', 'profile name');

        return res.status(200).json({ message: "Profile updated successfully", data: content });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

// exports.saveContent = async (req, res) => {
//     try {
//         const { roomId, content, type, senderId, createAt } = req.body;

//         if (!content || !type || !senderId || !roomId) {
//             return res.status(404).json({ message: 'Missing required content data' });
//         }

//         const room = await Room.findById(roomId);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }

//         const savedContent = await Message.create({ content, type, senderId, roomId, createAt });
//         await Room.findByIdAndUpdate(roomId, { lastContent: savedContent._id })

//         return res.status(200).json({ message: "Save content successfully", data: savedContent });

//     } catch (err) {
//         console.error(err.message)
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// }

exports.joinRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        if (!roomId) {
            return res.status(404).json({ success: false, message: 'Missing room id' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const newMember = await Room.findByIdAndUpdate(roomId, { $addToSet: { member: userId } });
        const joinedRoom = await newMember.populate('member', 'profile name');

        return res.status(200).json({ success: true, message: "Join room successfully", data: joinedRoom });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

///////////////////////////////// for socket ////////////////////////////////////////

exports.createRoom = async (data) => {
    try {
        const { name, isPrivate, member } = data;
        let searchKey;
        console.log('createRoom data: ', data);
        if (!name || typeof isPrivate !== "boolean" || !member) {
            throw new Error('Missing required fields');
        }
        if (isPrivate) {
            const friend = await User.findById(member[1])
            if (!friend) throw new Error('User not found');
            searchKey = (member.sort()).join("-") //123-456
        }
        const roomData = { name, member, isPrivate };
        if (searchKey) {
            roomData.searchKey = searchKey;
        }
        const newRoom = await Room.create(roomData);
        const savedRoom = await newRoom.populate('member', 'profile name');
        return savedRoom;

    } catch (err) {
        console.error('Error creating room:', err.message);
        throw err;
    }
}

exports.saveContent = async (data) => {
    try {
        const { roomId, content, type, senderId, createdAt } = data;

        if (!content || !type || !senderId || !roomId || !createdAt) {
            throw new Error("Missing required contentt data")
        }

        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error("Room not found")
        }

        const savedContent = await Message.create({ content, type, senderId, roomId, createdAt });
        const populateContent = await savedContent.populate('senderId', 'profile name');
        await Room.findByIdAndUpdate(roomId, { lastContent: savedContent._id })
        return populateContent;

    } catch (err) {
        console.error(err.message)
        throw err;
    }
}

exports.saveReactEmoji = async (data) => {
    try {
        const { reacterId, messageId, emoji } = data;

        if (!reacterId || !messageId || !emoji) {
            throw new Error("Missing required emoji data")
        }
        const user = await User.findById(reacterId);
        if (!user) {
            throw new Error("User not found")
        }
        const message = await Message.findById(messageId);
        if (!message) {
            throw new Error("Message not found")
        }

        const existingReaction = await ReactEmoji.findOne({ reacterId, messageId });

        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                // If the user clicks the same emoji, remove the reaction
                await ReactEmoji.findByIdAndDelete(existingReaction._id);
                await Message.findByIdAndUpdate(messageId, { $pull: { reactEmoji: existingReaction._id } });
            } else {
                // If the user clicks a different emoji, update the reaction
                await ReactEmoji.findByIdAndUpdate(existingReaction._id, { emoji });
            }
        } else {
            // If there's no existing reaction from the user, create a new one
            const newReaction = await ReactEmoji.create({ reacterId, messageId, emoji });
            await Message.findByIdAndUpdate(messageId, { $push: { reactEmoji: newReaction._id } });
        }

        const updatedMessage = await Message.findById(messageId).populate([
            { path: 'senderId', select: 'profile name' },
            { path: 'reactEmoji', populate: { path: 'reacterId', select: 'profile name' } }
        ]);

        return updatedMessage;

    } catch (err) {
        console.error(err.message)
        throw err;
    }
}

