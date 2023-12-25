const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path")
const { Chats, Users, Rooms } = require("../models");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|docx|pdf|txt|text|document/
        const mimetype = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }

        cb("Give proper file format to upload")
    }
}).single("filename")

// Create chat

router.post("/", upload, async (req, res) => {
    const { description, userId, roomId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json("Room ID or User ID should be given!")
    }

    if (description) {
        await Chats.create({
            description: description,
            RoomId: roomId,
            UserId: userId
        });
        return res.status(200).json("Chat created successfully!")
    } else {
        console.log(req.file);
        await Chats.create({
            filename: req.file.path,
            originalName: req.file.originalname,
            RoomId: roomId,
            UserId: userId
        });
        return res.status(200).json({ filename: req.file.path })
    }

})

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

module.exports = router;