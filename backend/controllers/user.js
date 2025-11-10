const User = require('../models/User')

exports.updateUserProfile = async (req, res) => {
    try {
        const { filePath, userId } = req.body;
        if (!filePath) {
            return res.status(400).json({ message: 'Missing file path' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { profile: filePath }, { new: true, runValidators: true })
        res.status(200).json({ message: "Profile updated successfully" , data: updatedUser});

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
