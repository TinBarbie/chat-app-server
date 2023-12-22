const express = require("express");
const router = express.Router();
const { Chats, Users, Rooms } = require("../models");

// Get All chats via room ID

router.get("/:roomId", async (req, res) => {
    const roomId = req.params.roomId
    if (!roomId) {
        return res.status(400).json("Room ID should be given!")
    }
    const chats = await Chats.findAll({
        where: { RoomId: roomId },
        include: [Users, Rooms]
    });

    return res.status(200).json(chats)
})

// Create chat

router.post("/", async (req, res) => {
    const chat = req.body;
    const chatMessage = chat.description;
    const roomId = chat.roomId
    const userId = chat.userId

    if (!roomId) {
        return res.status(400).json("Room ID should be given!")
    }
    if (!roomId) {
        return res.status(400).json("User ID should be given!")
    }
    if (!chatMessage) {
        return res.status(400).json("Chat message should be given!")
    }
    await Chats.create({
        description: chatMessage,
        RoomId: roomId,
        UserId: userId
    });

    return res.status(200).json("Chat created successfully")
})

module.exports = router;