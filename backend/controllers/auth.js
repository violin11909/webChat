const User = require('../models/User')

// @desc    Register
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, username, password } = req.body

        // Create user
        const user = await User.create({
            name,
            username,
            password
        })

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({ success: false })
        console.log(error.stack);
    }
}

// @desc    Login 
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { username, password } = req.body

    if (!username|| !password) {
        return res.status(400).json({
            success: false,
            msg: 'Please provide an email and password'
        })
    }
    const user = await User.findOne({ username }).select('+password')

    if (!user) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid credentials'
        })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid credentials'
        })
    }

    sendTokenResponse(user, 200, res);
}


const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode)/*.cookie('token',token,options)*/.json({
        success: true,
        //add for frontend
        _id: user._id,
        name: user.name,
        username: user.username,
        //end for frontend
        token
    })
}

// @desc    Get Me
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    console.log(req.user.id)
    const user = await User.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        data: user
    })
}