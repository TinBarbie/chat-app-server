const express = require("express");
const router = express.Router();
const { Userrooms } = require("../models");

// add user to the room

router.post("/", async (req, res) => {
    const { userId, roomId, userSocketId } = req.body;

    if (!userId || !roomId || !userSocketId) {
        return res.status(400).json("User ID or room ID or userSocketId is not given!")
    }

    const userroom = await Userrooms.findOne({ where: { UserId: userId, RoomId: roomId } })

    if (!userroom) {
        await Userrooms.create({ UserId: userId, RoomId: roomId, userSocketId: userSocketId })

        return res.status(200).json("Userroom created successfully!")
    }
    
    return res.status(200).json("User is already in the room!")
})

module.exports = router;