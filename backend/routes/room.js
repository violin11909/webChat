const express = require('express');
const router = express.Router();
const { getRooms, updateRoomProfile, getContentsByRoomId, saveContent, joinRoom, createRoom } = require('../controllers/room');


const { protect } = require('../middleware/auth')

router.get("/", getRooms)
router.get("/content/:roomId", getContentsByRoomId)
router.put("/update-profile", updateRoomProfile)
router.post("/save-content", saveContent)
router.post("/join-room", joinRoom)
router.post("/", protect, createRoom)

module.exports = router;