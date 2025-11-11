const express = require('express');
const router = express.Router();
const {getRooms, updateRoomProfile, createRoom} = require('../controllers/room');

const {protect} = require('../middleware/auth')

router.get("/", getRooms)
router.put("/update-profile", updateRoomProfile)
router.post("/", protect, createRoom)

module.exports = router;