const User = require('../models/User')

exports.updateUserProfile = async (req, res) => {
    try {
        const { userId, name, filePath } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (filePath) updateData.profile = filePath;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
        res.status(200).json({ message: "Profile updated successfully" , data: updatedUser});

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// @desc    Get All Users
// @route   GET /api/v1/user
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        // req query search by name
        const users = await User.find({
            name: { $regex: req.query.name || '', $options: 'i' }
        }).select('-password -username');
        res.status(200).json({ success: true, msg: 'Get users successfully', data: users })
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
        console.error(err.message);
    }
}