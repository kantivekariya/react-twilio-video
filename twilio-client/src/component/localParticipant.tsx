import React, { useState, useEffect, useRef, useCallback } from "react";

const LocalParticipants = ({ participant, room }: any) => {
  const [videoTracks, setVideoTracks] = useState<any>([]);
  const [audioTracks, setAudioTracks] = useState<any>([]);

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  const trackPubsToTracks = (trackMap: any[]) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackPubsToTracks(participant.videoTracks));
    setAudioTracks(trackPubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: { kind: string; }) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks: any) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks: any) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: { kind: string; }) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks: any[]) => videoTracks.filter((v: { kind: string; }) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks: any[]) => audioTracks.filter((a: { kind: string; }) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  /* Leave Room */
  console.log("room",room)
  const handleLogout = useCallback(() => {
    room.disconnect();
    window.location.href = '/'
  }, [room]);

  return (
    <div>
      {/* <img src="https://i.postimg.cc/521rVkhD/image.png" className="host-img" alt="" /> */}
      <div className="host-img">
        <video style={{width: '94vw',}} ref={videoRef}
          autoPlay={true}
          muted={false} />
        <audio ref={audioRef} autoPlay={true} muted={false} />
      </div>
      <div className="contarols">
        <img src="https://i.postimg.cc/3NVtVtgf/chat.png" alt="" />
        <img src="https://i.postimg.cc/BQPYHG0r/disconnect.png" alt="" />
        <img src="https://i.postimg.cc/fyJH8G00/call.png" className="call-icon" alt="" onClick={handleLogout}/>
        <img src="https://i.postimg.cc/bJFgSmFY/mic.png" alt="" />
        <img src="https://i.postimg.cc/Y2sDvCJN/cast.png" alt="" />
      </div>
    </div>
  );
};

export default LocalParticipants;