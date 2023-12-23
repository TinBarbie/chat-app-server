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

const chatRouter = require("./routes/Chats")
app.use("/chats", chatRouter)

const userRouter = require("./routes/Users")
app.use("/users", userRouter)



io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data.room)
        socket.to(data.room).emit("update_user", data);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    })

    socket.on("leave_room", (data) => {
        socket.to(data.room).emit("kick_user", data);
        console.log(`User with ID: ${socket.id} leaved room: ${data.room}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
        console.log(data);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        socket.broadcast.emit("callEnded")
    })

    socket.on("call_user", (data) => {
        io.to(data.userToCall).emit("call_user", { signal: data.signalData, from: data.From, name: data.name })
    })

    socket.on("answer_call", (data) => {
        io.to(data.to).emit("accept_call", data.signal)
    })
})
db.sequelize.sync().then(() => {
    server.listen(3001, () => {
        console.log("server is running on port 3001");
    })
})
