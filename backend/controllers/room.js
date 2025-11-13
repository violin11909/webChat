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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const totalMessages = await Message.countDocuments({ roomId: roomId });

        const content = await Message.find({ roomId: roomId })
            .sort({ createdAt: -1 }) // Sort by newest first for pagination
            .skip(skip)
            .limit(limit)
            .populate([
                { path: 'senderId', select: 'profile name' },
                { path: 'reactEmoji', select: 'emoji', populate: { path: 'reacterId', select: 'profile name' } }
            ]);
        
        const reversedContent = content.reverse();

        return res.status(200).json({ 
            message: "Messages fetched successfully", 
            data: reversedContent,
            pagination: {
                total: totalMessages,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalMessages / limit)
            }
        });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

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

        const joinedRoom = await Room.findByIdAndUpdate(
            roomId, 
            { $addToSet: { member: userId } },
            { new: true }
        ).populate('member', 'profile name');

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
        if (!name || typeof isPrivate !== "boolean" || !member) {
            throw new Error('Missing required fields');
        }

        if (isPrivate) {
            // For private rooms, check if a room already exists between the two users.
            const searchKey = member.sort().join("-");
            const existingRoom = await Room.findOne({ searchKey: searchKey });

            if (existingRoom) {
                // If room exists, populate and return it instead of creating a new one.
                const populatedRoom = await existingRoom.populate('member', 'profile name');
                return populatedRoom;
            }

            // If no room exists, proceed to create one with the searchKey.
            const roomData = { name, member, isPrivate, searchKey };
            const newRoom = await Room.create(roomData);
            const savedRoom = await newRoom.populate('member', 'profile name');
            return savedRoom;

        } else {
            // For public groups, just create it.
            const roomData = { name, member, isPrivate };
            const newRoom = await Room.create(roomData);
            const savedRoom = await newRoom.populate('member', 'profile name');
            return savedRoom;
        }

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

