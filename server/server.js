import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow all origins
    methods: ["GET", "POST"], // Specify allowed HTTP methods
  },
});

// middlewares
app.use(cors());
app.use(express.json());

const roomList = [];
const roomMessages = [];

io.on("connection", (socket) => {
  console.log(`\nserver: user connected to socket: ${socket.id}`);
  console.log(`users connected to socket: ${io.engine.clientsCount}`);

  // if previous roomlist available then send to client
  if (roomList !== null && roomList.length > 0) {
    socket.emit("roomList", roomList);
  }

  // joining a room
  socket.on("joinRoom", (roomName) => {
    // checking roomName value
    if (!roomName || typeof roomName !== "string") {
      console.error(`server: Invalid room name`);
      return;
    }

    socket.join(roomName);

    // Check if room exists
    let room = roomList.find((r) => r.roomName === roomName);

    if (!room) {
      room = { roomName, users: [socket.id] };
      roomList.push(room);
      console.log(`\nNew room created: ${roomName}`);
    }

    console.log(`\nCurrent room list: ${JSON.stringify(roomList)}`);

    socket.emit("roomList", roomList);
  });

  socket.on("sendMessage", (data) => {
    const { roomName, message, senderId } = data;
    roomMessages.push(data);

    console.log(`i stored it in the array: ${roomMessages}`);

    // io.to(roomName).emit("message", roomMessages);
  });

  socket.on("showRoomMessage", (roomName) => {
    const allRoomMsgs = roomMessages.filter((msg) => msg.roomName === roomName);
    io.to(roomName).emit("message", allRoomMsgs);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});
server.listen(8989, () => {
  console.log(`✅ Server connected successfully at port 8989`);
});
export default server;
