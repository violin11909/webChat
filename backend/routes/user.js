const express = require('express');
const router = express.Router();
const {updateUserProfile} = require('../controllers/user');

router.put("/update-profile", updateUserProfile)

module.exports = router;