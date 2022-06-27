import { useEffect, useState } from "react";
import Participant from "./participant";

interface Props {
  roomName: string;
  room: any;
  handleLogout: (event: any) => void;
}

const Room = ({ roomName, room, handleLogout }: Props) => {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    /* Participant Connected */
    const participantConnected = (participant: any) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    /* Participant disconnected */
    const participantDisconnected = (participant: any) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant: { sid: any }) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>End Call</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
