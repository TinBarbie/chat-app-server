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

const userRoomRouter = require("./routes/Userrooms")
app.use("/userrooms", userRoomRouter)

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
        console.log(data);
    })

    socket.on("call_user", (data) => {
        io.to(data.userToCall).emit("call_user", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answer_call", (data) => {
        io.to(data.to).emit("call_accepted", data.signal)
    })

    // socket.on("join_call_room", (roomID) => {
    //     if (users[roomID]) {
    //         if (!users[roomID].includes(socket.id)) {
    //             users[roomID].push(socket.id)
    //         }
    //     } else {
    //         users[roomID] = [socket.id]
    //     }
    //     socketToRoom[socket.id] = roomID
    //     const usersInThisRoom = users[roomID].filter(id => id !== socket.id)
    //     console.log(users)
    //     console.log(socketToRoom)
    //     socket.emit("all_users", usersInThisRoom)
    // })

    // socket.on("send_signal", (data) => {
    //     io.to(data.userToSignal).emit("user_joined", { signal: data.signal, callerID: data.callerID, name: data.name })
    // })

    // socket.on("return_signal", (data) => {
    //     io.to(data.callerID).emit("receive_return_signal", { signal: data.signal, id: socket.id })
    // })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        socket.broadcast.emit("callEnd")
    })
})
db.sequelize.sync().then(() => {
    server.listen(3001, () => {
        console.log("server is running on port 3001");
    })
})
