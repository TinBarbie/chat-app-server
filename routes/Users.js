const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt")

// Get All users

router.get("/", async (req, res) => {
    const users = await Users.findAll();

    return res.status(200).json({ users: users })
})

// Create user

router.post("/", async (req, res) => {
    const user = req.body;
    const userName = user.name;
    const password = user.password;
    if (!userName || !password) {
        return res.status(400).json("User name or password is not given!")
    }
    await bcrypt.hash(password, 10).then((hash) => {
        Users.create({ name: userName, password: hash });
    })

    return res.status(200).json("User created successfully")
})

module.exports = router;
