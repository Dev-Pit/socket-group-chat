import { useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

function App() {
  const [roomList, setRoomList] = useState([]); // list of rooms to display in select
  const [roomMessages, setRoomMessages] = useState([]);
  // for Right Panel
  const [selectedRoom, setSelectedRoom] = useState("");

  // * functions for Left panel
  // Join Room
  const joinRoom = (data) => {
    if (data) {
      // setRoom(data);
      socket.emit("joinRoom", data);
    }
  };

  // send message to room
  const handleMessageToRoom = (roomName, message) => {
    // console.log(`Room name: ${roomName} and message: ${message}`);
    socket.emit("sendMessage", { roomName, message, senderId: socket.id });
  };

  //* right panel
  const handleSetSelectedRoom = (roomName) => {
    setSelectedRoom(roomName);
    // displayRoomMessage(roomName);
  };
  // Memoize displayRoomMessage to prevent unnecessary re-renders
  const displayRoomMessage = (roomName) => {
    if (roomName) {
      socket.emit("showRoomMessage", roomName);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`:smile client: connection established: ${socket}`);
    });

    // fetch list of rooms from server
    socket.on("roomList", (data) => {
      setRoomList(data);
    });

    // * messages will be displayed by room name
    socket.on("message", (data) => {
      console.log(`client: message received: ${JSON.stringify(data)}`);
      setRoomMessages(data);
    });

    return () => {
      socket.off("connect");
      socket.off("roomList");
      socket.off("message");
    };
  }, [selectedRoom]);
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
        selectedRoom={selectedRoom}
        handleSetSelectedRoom={handleSetSelectedRoom}
      />
    </div>
  );
}

export default App;
