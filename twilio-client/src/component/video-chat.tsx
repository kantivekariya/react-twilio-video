import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  connect,
  LocalAudioTrack,
  LocalDataTrack,
  LocalVideoTrack,
} from "twilio-video";
import { baseUrl } from "../config/config";
import Lobby from "./lobby";
import Room from "./room";
import { toast } from "react-toastify";

const videoConstraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
};

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
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
      const accessToken = await fetch(`${baseUrl}/rooms/join-room`, {
        method: "POST",
        body: JSON.stringify({
          roomName: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      connectRoom(accessToken.token, roomName)
    },
    [username, roomName,]
  );

  const connectRoom = useCallback((accessToken: string, roomName: string) => {
    navigator.mediaDevices
      .getUserMedia(videoConstraints)
      .then(async (stream) => {
        let tracks;

        /* create data track for messages */
        const audioTrack = new LocalAudioTrack(stream.getAudioTracks()[0]);
        const dataTrack = new LocalDataTrack();


        let videoTrack;
        videoTrack = new LocalVideoTrack(stream.getVideoTracks()[0]);
        tracks = [audioTrack, videoTrack, dataTrack];

        const room = await connect(accessToken, {
          name: roomName,
          tracks,
        });
        console.log("succesfully connected with twilio room");
        console.log(room);
        setRoom(room)
      })
      .catch((err) => {
        toast.error(err.message);
      });

  }, [])

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
      const tidyUp = (event: any) => {
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
