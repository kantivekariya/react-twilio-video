import { useEffect, useState } from "react";
import LocalParticipants from "./localParticipant";
import RemoteParticipant from "./remoteParticipant";

interface Props {
  roomName: string;
  room: any;
}

const Room = ({ roomName, room }: Props) => {
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
    <div className="joined">
      <RemoteParticipant
        room={room}
        key={participant.sid}
        participant={participant}
      />
    </div>
  ));

  return (
    <>
      <div>{remoteParticipants}</div>
      <div>
        {room && (
          <LocalParticipants
            room={room}
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        )}
      </div>
    </>
  );
};

export default Room;
