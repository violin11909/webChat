const Room = require('../models/Room')
const User = require('../models/User')


exports.createRoom = async (name, isPrivate, member) => {
    try {

        if (!name || !member || !isPrivate) {
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