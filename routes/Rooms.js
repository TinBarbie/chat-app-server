const express = require("express");
const router = express.Router();
const { Rooms, Users } = require("../models");

// Get All rooms

router.get("/", async (req, res) => {
    const rooms = await Rooms.findAll();

    return res.status(200).json({ rooms: rooms })
})

// Create room

router.post("/", async (req, res) => {
    const room = req.body;
    const roomName = room.name;
    if (!roomName) {
        return res.status(400).json("Room name is not given!")
    }
    await Rooms.create({ name: roomName });

    return res.status(200).json("Room created successfully")
})

module.exports = router;