import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://socket-group-chat.vercel.app", //https://socket-group-chat.vercel.app/ Allow origins
    methods: ["GET", "POST"], // Specify allowed HTTP methods
  },
});

// middlewares
app.use(cors());
app.use(express.json());

const roomList = [];
const roomMessages = [];

io.on("connection", (socket) => {
  // console.log(`\nserver: user connected to socket: ${socket.id}`);
  // console.log(`users connected to socket: ${io.engine.clientsCount}`);

  // if previous roomlist available then send to client
  if (roomList !== null && roomList.length > 0) {
    socket.emit("roomList", roomList);
  }

  // * for Left Panel
  // joining a room
  socket.on("joinRoom", (roomName) => {
    // checking roomName value
    if (!roomName || typeof roomName !== "string") {
      // console.error(`server: Invalid room name`);
      return;
    }

    socket.join(roomName);

    // Check if room exists
    let room = roomList.find((r) => r.roomName === roomName);

    if (!room) {
      room = { roomName, users: [socket.id] };
      roomList.push(room);
      // console.info(`\nserver: New room created: ${roomName}`);
    }

    // console.info(`\ncurrent room list: ${JSON.stringify(roomList)}`);

    io.to(roomName).emit("roomList", roomList);
  });

  // fetch roomList
  socket.on("fetchRoomList", () => {
    // console.log(`server: fetching room list`);
    socket.emit("roomList", roomList);
  });

  // when sending message event triggered
  socket.on("sendMessage", (data) => {
    const { roomName, message, senderId } = data;
    roomMessages.push(data);

    // console.log(
    //   `\nserver: msg sent from left panel: ${JSON.stringify(roomMessages)}`
    // );

    io.emit("newMessage", roomName);
  });

  socket.on("showRoomMessage", (roomName) => {
    // console.log(`\nserver: show room message for room: ${roomName}`);
    const allRoomMsgs = roomMessages.filter((msg) => msg.roomName === roomName);
    // console.log(`\nlist of room messages: ${allRoomMsgs}`);
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
