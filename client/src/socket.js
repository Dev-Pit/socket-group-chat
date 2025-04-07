import io from "socket.io-client";

const socket = io("https://socket-group-chat-f710.onrender.com", {
  //https://socket-group-chat-f710.onrender.com // http://localhost:8989
  transports: ["websocket"], // Ensure WebSocket transport is used
  reconnectionAttempts: 3, // Limit reconnections
  reconnectionDelay: 2000, // Delay between retries
});

export default socket;
