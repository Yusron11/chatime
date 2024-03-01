const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const app = express();
const socket = require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute)
app.use("/api/messages", messageRoute)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connection Successfull");
}).catch((err) => {
    console.log(err.message);
});


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin:"http://localhost:3000",
        Credential: true,
    }
})

global.onlineusers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineusers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineusers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", { message: data.message, fromSelf: false });
        }
    });
});

