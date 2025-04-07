import React, { useEffect } from "react";

const RightPanel = ({
  roomList,
  roomMessages,
  displayRoomMessage,
  selectedRoom,
  handleSetSelectedRoom,
}) => {
  const handleChange = (e) => {
    const newRoom = e.target.value;
    displayRoomMessage(newRoom); // Trigger message fetch for new room
    handleSetSelectedRoom(newRoom);
  };

  useEffect(() => {
    if (roomList?.length > 0) {
      const initialRoom = roomList[0].roomName;
      console.log(`\nclient: Right panel: room name got: ${initialRoom}`);
      displayRoomMessage(initialRoom); // Fetch messages for initial room
      handleSetSelectedRoom(initialRoom);
    }
  }, [roomList, displayRoomMessage, handleSetSelectedRoom]);

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
        {Array.isArray(roomMessages) && roomMessages.length === 0 ? (
          roomMessages.map((msg, index) => (
            <p key={index}>
              {msg.message}
              <span className="mx-3 bg-green-300 p-1 font-bold">
                [sender]: {msg.senderId}
              </span>
            </p>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
