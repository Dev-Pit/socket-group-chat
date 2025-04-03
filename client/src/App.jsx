import { useCallback, useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

function App() {
  const [roomList, setRoomList] = useState([]); // list of rooms to display in select
  const [roomMessages, setRoomMessages] = useState([]);

  // * Left panel
  const [room, setRoom] = useState("");
  // Join Room
  const joinRoom = (data) => {
    if (data.trim()) {
      setRoom(data);
      socket.emit("joinRoom", data);
    }
  };

  // send message to room
  const handleMessageToRoom = (roomName, message) => {
    // console.log(`Room name: ${roomName} and message: ${message}`);
    socket.emit("sendMessage", { roomName, message, senderId: socket.id });
  };

  // right panel
  // Memoize displayRoomMessage to prevent unnecessary re-renders
  const displayRoomMessage = useCallback((roomName) => {
    if (roomName) {
      socket.emit("showRoomMessage", roomName);
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log(`client: connected to server: socket: ${socket}`);
    });

    // fetch list of rooms from server
    socket.on("roomList", (data) => {
      setRoomList(data);
    });

    socket.on("message", (data) => {
      setRoomMessages(data);
    });

    return () => {
      socket.off("connect");
      socket.off("roomList");
    };
  }, [room]);
  return (
    <div className="w-[80vw] h-[80vh] flex justify-center align-middle">
      <LeftPanel
        roomList={roomList}
        joinRoom={joinRoom}
        handleMessageToRoom={handleMessageToRoom}
      />

      <RightPanel
        roomList={roomList}
        displayRoomMessage={displayRoomMessage}
        roomMessages={roomMessages}
      />
    </div>
  );
}

export default App;
