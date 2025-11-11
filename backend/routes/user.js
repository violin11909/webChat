const express = require('express');
const router = express.Router();
const {updateUserProfile, getUsers} = require('../controllers/user');
const { protect } = require('../middleware/auth');

router.put("/update-profile", updateUserProfile)
router.get("/", protect, getUsers)

module.exports = router;