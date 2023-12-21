const express = require("express")
const http = require("http")
const app = express()
const cors = require("cors")

const server = http.createServer(app)
const { Server } = require("socket.io")

app.use(express.json());
app.use(cors())

const db = require("./models");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const roomRouter = require("./routes/Rooms")
app.use("/rooms", roomRouter)

const userRouter = require("./routes/Users")
app.use("/users", userRouter)

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })
})
db.sequelize.sync().then(() => {
    server.listen(3001, () => {
        console.log("server is running on port 3001");
    })
})
