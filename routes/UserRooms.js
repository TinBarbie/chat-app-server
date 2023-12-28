const express = require("express");
const router = express.Router();
const { Userrooms } = require("../models");

//Check if user leaved the room or not
router.get("/", async (req, res) => {
    const { userId, roomId } = req.body;

    if (!userId || !roomId) {
        return res.status(400).json("User ID or room ID is not given!")
    }

    const userroom = await Userrooms.findOne({ where: { UserId: userId, RoomId: roomId } })

    if (!userroom) {
        return res.status(400).json("User is not in the room!")
    }
    return res.status(200).json(`User ${userId} is in room ${roomId}`)
})

module.exports = router;

// add user to the room

router.post("/", async (req, res) => {
    const { userId, roomId, userSocketId } = req.body;

    if (!userId || !roomId || !userSocketId) {
        return res.status(400).json("User ID or room ID or userSocketId is not given!")
    }

    await Userrooms.create({ UserId: userId, RoomId: roomId, userSocketId: userSocketId })

    return res.status(200).json("Userroom created successfully!")
})

module.exports = router;