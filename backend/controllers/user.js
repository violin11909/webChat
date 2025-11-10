const User = require('../models/User')

exports.editUserProfile = async (filePath, userId) => {
    try {
        if (!filePath) {
            throw Error('Missing file path');
        }
        const user = await User.findById(userId);
        if (!user) {
            throw Error('User not found');
        }

        const upDatedProfile = await User.findByIdAndUpdate(userId, { profile: filePath }, { new: true, runValidators: true })
        //หรือไม่ควร await ดี
        return upDatedProfile;

    } catch (err) {
        throw err;
    }
}
