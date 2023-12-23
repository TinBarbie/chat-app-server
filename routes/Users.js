const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt")
const { sign, verify } = require("jsonwebtoken");

// Get User Identity

router.get("/auth", async (req, res) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) return res.json({ error: "Access token should be given!" });

    try {
        const validToken = verify(accessToken, "importantsecret");
        return res.status(200).json(validToken)
    } catch (err) {
        return res.status(403).json("Access token is not valid!");
    }
})

// Create user

router.post("/", async (req, res) => {
    const user = req.body;
    const userName = user.username;
    const password = user.password;
    if (!userName || !password) {
        return res.status(400).json("User name or password is not given!")
    }
    await bcrypt.hash(password, 10).then((hash) => {
        Users.create({ name: userName, password: hash });
    })

    return res.status(200).json("User created successfully!")
})

// Login

router.post("/login", async (req, res) => {
    const user = req.body;
    const userName = user.username;
    const password = user.password;

    if (!userName || !password) {
        return res.status(400).json("User name or password is not given!")
    }

    const userInstance = await Users.findOne({ where: { name: userName } });

    if (!userInstance) {
        return res.status(404).json({ error: "User Doesn't Exist" });
    }

    bcrypt.compare(password, userInstance.password).then(async (match) => {
        if (!match) res.status(403).json({ error: "Wrong Username And Password Combination" });

        const accessToken = sign(
            { username: userInstance.name, id: userInstance.id },
            "importantsecret"
        );
        return res.status(200).json({ token: accessToken, username: userName, id: userInstance.id });
    });
});

module.exports = router;
