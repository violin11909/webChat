const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Message')

exports.getRooms = async (req, res) => {
    try {

        const rooms = await Room.find().populate("member", "profile name");
        return res.status(200).json({ success: true, msg: 'Get rooms successfully', data: rooms })

    } catch (err) {
        return res.status(500).json({ success: false, msg: 'Error fetching room' })

    }
}

exports.createRoom = async (name, isPrivate, member) => {
    try {

        if (!name || !member || typeof isPrivate !== "boolean") {
            throw Error('Missing required room data');
        }

        if (isPrivate) {
            const friend = await User.findById(member[1])
            if (!friend) {
                throw new Error('Friend not founded');
            }
        }

        const savedRoom = await Room.create({ name, member, isPrivate });
        return savedRoom;

    } catch (err) {
        throw err;
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

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const content = await Message.find({ roomId: roomId }).sort({ createdAt: 1 });

        return res.status(200).json({ message: "Profile updated successfully", data: content });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.saveContent = async (req, res) => {
    try {
        const { roomId, content, type, senderId, createAt } = req.body;

        if (!content || !type || !senderId || !roomId) {
            return res.status(404).json({ message: 'Missing required content data' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const savedContent = await Message.create({ content, type, senderId, roomId, createAt });
        await Room.findByIdAndUpdate(roomId, { lastContent: savedContent._id })

        return res.status(200).json({ message: "Save content successfully", data: savedContent });

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

        await Room.findByIdAndUpdate(roomId, { $addToSet: { member: userId } });
        return res.status(200).json({ success: true, message: "Join room successfully" });

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

