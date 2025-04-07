import React, { useEffect, useState } from "react";
import { BiSolidDoorOpen } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";

import socket from "./socket"; // import socket instance

const LeftPanel = ({ roomList }) => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // const [roomList, setRoomList] = useState([]); // list of rooms to display in select

  // * functions for Left panel
  // Join Room
  const joinRoom = (data) => {
    if (data) {
      socket.emit("joinRoom", data);
    }
  };

  // create room
  const handleCreateRoom = () => {
    const roomName = room.trim();
    if (roomName) {
      joinRoom(roomName);
      setRoom("");
    } else {
      alert("Insert room name!");
    }
  };

  // send message to room
  const handleMessageToRoom = (roomName, message) => {
    // console.log(`Room name: ${roomName} and message: ${message}`);
    socket.emit("sendMessage", { roomName, message, senderId: socket.id });
    // fetchRoomMessage(roomName);
  };
  // Send Message
  const sendMessage = () => {
    // console.log(`client: LeftPanel: send button clicked\n`);
    if (selectedRoom && message) {
      // console.log(`leftPanel: sss ${selectedRoom} and message: ${message}`);
      handleMessageToRoom(selectedRoom, message);
      setMessage(""); // Clear input after sending
    }
  };

  useEffect(() => {
    if (roomList !== null && roomList.length > 0) {
      setSelectedRoom(roomList[0].roomName);
    }
  }, [roomList]);

  return (
    <div className="flex flex-1/3 flex-col gap-1 justify-center items-center p-5 ">
      <h2 className="text-3xl font-bold underline mb-5">Socket.io Room Chat</h2>

      {/* Create Room */}
      <input
        className="w-80 h-12 px-4 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
        placeholder="Enter room name"
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        className="text-white px-4 py-2 rounded-lg flex justify-center items-center gap-1"
        onClick={handleCreateRoom}>
        <BiSolidDoorOpen />
        <span>Create Room / Join Room</span>
      </button>

      <hr className="my-5 w-full border-t-2" />

      {/* Message to room  */}
      <p className="font-bold">Select Room</p>
      {roomList !== null && roomList.length > 0 ? (
        <>
          {" "}
          <select
            className="w-auto max-w-fit inline-block border-2 rounded p-2 mb-2"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}>
            {roomList.map((room, index) => (
              <option key={index} value={room.roomName}>
                {room.roomName}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <p>You haven't created any room yet!</p>
        </>
      )}

      <input
        className="w-80 h-12 px-4 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-2"
        placeholder="Enter your message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className=" text-white px-4 py-2 rounded-lg flex justify-center items-center gap-1"
        onClick={sendMessage}>
        <RiSendPlaneFill />
        <span>Send</span>
      </button>
    </div>
  );
};

export default LeftPanel;
