const Room = require('../models/Room')
const User = require('../models/User')


exports.getRooms = async (req, res) => {
    try {

        const rooms = await Room.find();
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
            return res.status(400).json({ message: 'Missing file path' });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { profile: filePath }, { new: true, runValidators: true })
        res.status(200).json({ message: "Profile updated successfully" , data: updatedRoom});

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
