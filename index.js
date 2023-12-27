const express = require("express")
const http = require("http")
const app = express()
const cors = require("cors")

const server = http.createServer(app)
const { Server } = require("socket.io")

app.use(express.json())
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

const chatRouter = require("./routes/Chats")
app.use("/chats", chatRouter)

const userRouter = require("./routes/Users")
app.use("/users", userRouter)

const userRoomRouter = require("./routes/UserRooms")
app.use("/userrooms", userRoomRouter)

app.use('/assets', express.static('./assets'));

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    socket.emit("me", socket.id)

    socket.on("join_room", (data) => {
        socket.join(data.room)
        data.userSocketId = socket.id
        socket.to(data.room).emit("update_user", data);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    })

    socket.on("leave_room", (data) => {
        socket.to(data.room).emit("kick_user", data);
        console.log(`User with ID: ${socket.id} leaved room: ${data.room}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("call_user", (data) => {
        console.log(data)
        io.to(data.userToCall).emit("call_user", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answer_call", (data) => {
        io.to(data.to).emit("call_accepted", data.signal)
    })

    socket.on("end_call", (idToCall) => {
        socket.to(idToCall).emit("end_call")
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        socket.broadcast.emit("callEnded")
    })
})
db.sequelize.sync().then(() => {
    server.listen(3001, () => {
        console.log("server is running on port 3001");
    })
})

module.exports = app;
