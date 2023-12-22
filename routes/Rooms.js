const express = require("express");
const router = express.Router();
const { Rooms, Users } = require("../models");

// Get All rooms

router.get("/", async (req, res) => {
    const rooms = await Rooms.findAll();

    return res.status(200).json(rooms)
})

// Get room via ID

router.get("/:roomId", async (req, res) => {
    const roomId = req.params.roomId
    if (!roomId) {
        return res.status(400).json("Room ID is not given!")
    }
    const room = await Rooms.findOne({
        where: {id: roomId},
        include: Users
    });
    return res.status(200).json(room)
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