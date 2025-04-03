import React, { useEffect, useState } from "react";

const RightPanel = ({ roomList, roomMessages, displayRoomMessage }) => {
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleChange = (e) => {
    const newRoom = e.target.value;
    setSelectedRoom(newRoom);
    displayRoomMessage(newRoom); // Trigger message fetch for new room
  };

  useEffect(() => {
    if (roomList?.length > 0) {
      const initialRoom = roomList[0].roomName;
      setSelectedRoom(initialRoom);
      displayRoomMessage(initialRoom); // Fetch messages for initial room
    }
  }, [roomList, displayRoomMessage]); // Include displayRoomMessage in dependencies

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

      <div className="bg-amber-100 w-[100%] h-[100%]">
        {roomMessages?.map((msg, index) => (
          <p key={index}>{msg.message}</p>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
