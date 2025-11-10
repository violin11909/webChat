const express = require('express');
const router = express.Router();
const {getRooms, updateRoomProfile} = require('../controllers/room');

const {protect} = require('../middleware/auth')

router.get("/", getRooms)
router.put("/update-profile", updateRoomProfile)


module.exports = router;