const express = require("express");
const router = express.Router();
const { Userrooms } = require("../models");

// add user to the room

router.post("/", async (req, res) => {
    const { userId, roomId, userSocketId } = req.body;

    console.log(userSocketId)
    if (!userId || !roomId || !userSocketId) {
        return res.status(400).json("User ID or room ID or userSocketId is not given!")
    }

    await Userrooms.create({ UserId: userId, RoomId: roomId, userSocketId: userSocketId })

    return res.status(200).json("Userroom created successfully!")
})

// router.post("/userroom", async (req, res) => {
//     const { userId, roomId } = req.body;

//     if (!userId || !roomId) {
//         return res.status(400).json("User ID or room ID is not given!")
//     }

//     const room = await Rooms.findByPk(roomId);
//     const user = await Users.findByPk(userId);

//     if (!room) {
//         return res.status(404).json({ error: "Room Doesn't Exist" });
//     }

//     if (!user) {
//         return res.status(404).json({ error: "User Doesn't Exist" });
//     }

//     await room.addUser(user);

//     return res.status(200).json("User is added to room successfully!")
// })

module.exports = router;