const Room = require('../models/Room')
const User = require('../models/User')


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

exports.editRoomProfile = async (filePath, roomId) => {
    try {
        if (!filePath) {
            throw Error('Missing file path');
        }
        const room = await Room.findById(roomId);
        if (!room) {
            throw Error('Room not found');
        }

        const upDatedProfile = Room.findByIdAndUpdate(roomId, { profile: filePath }, { new: true, runValidators: true })
        // await ออกเพราะต้องการให้ user ไม่ต้องรอ update profile on mongo ดีมั้ย?
        return upDatedProfile;

    } catch (err) {
        throw err;
    }
}
