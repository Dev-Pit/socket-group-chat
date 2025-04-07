import { useCallback, useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

function App() {
  const [roomList, setRoomList] = useState([]); // list of rooms to display in select
  // for RightPanel
  const [messages, setMessages] = useState([]); // messages that need to be displayed

  const fetchRoomList = () => {
    socket.emit("fetchRoomList");
  };

  const fetchRoomMessage = useCallback((roomName) => {
    console.log(`fetching room messages from room: ${roomName}`);
    socket.emit("showRoomMessage", roomName);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected to socket: ${JSON.stringify(socket.id)}\n`);
    });
    fetchRoomList();
    socket.on("roomList", (rooms) => {
      console.log(`client: LeftPanel: room list received`);
      setRoomList(rooms);
    });

    socket.on("message", (data) => {
      console.log(`left panel: got message: ${JSON.stringify(data)}`);
      setMessages(data);
    });

    return () => {
      // Cleanup socket listeners on component unmount
      socket.off("connect");
      socket.off("roomList");
      socket.off("message");
    };
  }, []);

  return (
    <div className="w-[80vw] h-[80vh] flex justify-center align-middle">
      <LeftPanel roomList={roomList} fetchRoomMessage={fetchRoomMessage} />

      <RightPanel
        roomList={roomList}
        fetchRoomMessage={fetchRoomMessage}
        messages={messages}
      />
    </div>
  );
}

export default App;
