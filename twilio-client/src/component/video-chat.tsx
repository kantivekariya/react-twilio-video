import React, { useCallback, useState } from "react";
import Lobby from "./lobby";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);

  const handleUsernameChange = useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const data = await fetch('http://localhost:5000/rooms/join-room', {
      method: 'POST',
      body: JSON.stringify({
        roomName: roomName
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    setToken(data?.token)
  }, [username, roomName]);

  const handleLogout = useCallback((event: any) => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <div>
        <p>Username: {username}</p>
        <p>Room name: {roomName}</p>
        <p>Token: {token}</p>
      </div>
    );
  } else {
    render = (
      <Lobby
         username={username}
         roomName={roomName}
         handleUsernameChange={handleUsernameChange}
         handleRoomNameChange={handleRoomNameChange}
         handleSubmit={handleSubmit}
      />
    );
  }
  return render;
};

export default VideoChat;
