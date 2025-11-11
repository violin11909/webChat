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
exports.createRoom = async (req, res) => {
    try {
        const { name, isPrivate, member } = req.body;
        if (!name || !member || typeof isPrivate !== "boolean") {
            return res.status(400).json({ success:false, message: 'Missing required fields' });
        }

        if (isPrivate) {
            const friend = await User.findById(member[1])
            if (!friend) {
                return res.status(404).json({ success:false, message: 'User not found' });
            }
        }

        const savedRoom = await Room.create({ name, member, isPrivate });
        res.status(201).json({ success:true, message: 'Room created successfully', data: savedRoom });
    } catch (err) {
        console.error('Error creating room:', err.message);
        res.status(500).json({ success:false, message: 'Server error' });
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

