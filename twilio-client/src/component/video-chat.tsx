import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import Video from "twilio-video";
import Lobby from "./lobby";
import Room from "./room";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState<any>(null);
  const [connecting, setConnecting] = useState(false);

  const handleUsernameChange = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setUsername(event.target.value);
    },
    []
  );

  const handleRoomNameChange = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setRoomName(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
      const data = await fetch("http://localhost:5000/rooms/join-room", {
        method: "POST",
        body: JSON.stringify({
          roomName: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room: any) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err: any) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [username, roomName]
  );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom: { localParticipant: { tracks: { track: { stop: () => void; }; }[]; }; disconnect: () => void; }) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub: { track: { stop: () => void; }; }) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (room) {
      const tidyUp = (event:any) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room
        roomName={roomName}
        handleLogout={handleLogout}
        room={room}
      />
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
