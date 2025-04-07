import React, { useEffect } from "react";
import socket from "./socket";

const RightPanel = ({ roomList, fetchRoomMessage, messages }) => {
  const [selectedRoom, setSelectedRoom] = React.useState("");
  // const [messages, setMessages] = React.useState([]);

  const handleChange = (e) => {
    const newRoom = e.target.value;
    setSelectedRoom(newRoom);
    // socket.emit("showRoomMessage", newRoom);
    fetchRoomMessage(newRoom);
  };

  useEffect(() => {
    if (roomList.length > 0) {
      const roomName = roomList[0].roomName;
      setSelectedRoom(roomName);
    }
  }, [roomList]);

  useEffect(() => {
    fetchRoomMessage(selectedRoom);
    socket.on("newMessage", (roomName) => {
      if (roomName === selectedRoom) {
        fetchRoomMessage(selectedRoom);
      }
    });
    return () => {
      socket.off("newMessage");
    };
  }, [fetchRoomMessage, selectedRoom]);

  // fetch component on message mount
  useEffect(() => {
    if (selectedRoom) {
      fetchRoomMessage(selectedRoom);
    }
  }, [fetchRoomMessage, selectedRoom]);

  return (
    <div className="flex flex-2/3  flex-col gap-1 p-5 border-l">
      <h3 className="text-3xl font-bold underline">Chat list</h3>

      {roomList?.length > 0 ? (
        <select
          className="w-auto max-w-fit inline-block border-2 rounded p-2 mt-5"
          value={selectedRoom}
          onChange={handleChange}>
          {roomList.map((room, index) => (
            <option key={index} value={room.roomName}>
              {room.roomName}
            </option>
          ))}
        </select>
      ) : (
        <p>No room available!</p>
      )}

      {/* display messages of the room */}
      <div className="bg-amber-100 w-[100%] h-[100%] p-5">
        {/* display msg list here */}
        {messages?.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="border-b-2 border-gray-300 p-2">
              <p>
                <strong>{msg.message}:</strong>
                <span className="text-[9px]">[{msg.senderId}]</span>
              </p>
            </div>
          ))
        ) : (
          <p>No messages available!</p>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
