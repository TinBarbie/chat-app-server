const express = require("express");
const router = express.Router();
const { UserRooms } = require("../models");

// Create userroom

router.post("/", async (req, res) => {
    const { userId, roomId } = req.body;

    if (!userId || !roomId) {
        return res.status(400).json("User ID or room ID is not given!")
    }

    await UserRooms.create({ where: { userId: userId, roomId: roomId } })

    return res.status(200).json("Userroom created successfully!")
})