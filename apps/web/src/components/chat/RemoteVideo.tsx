"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MonitorSmartphone } from "lucide-react";

type RemoteVideoProps = {
  partnerName?: string;
  partnerStatus?: string;
  stream?: MediaStream | null;
};

export default function RemoteVideo({
  partnerName = "Stranger",
  partnerStatus = "Waiting",
  stream = null,
}: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasRemoteTracks, setHasRemoteTracks] = useState(false);

  const remoteTrackCount = useMemo(() => {
    return stream?.getTracks().length ?? 0;
  }, [stream]);

  useEffect(() => {
    setHasRemoteTracks(remoteTrackCount > 0);
  }, [remoteTrackCount]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;

      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error("remote video play failed:", error);
        }
      };

      playVideo();
    } else {
      videoRef.current.srcObject = null;
      setHasRemoteTracks(false);
    }
  }, [stream]);

  return (
    <div className="card relative overflow-hidden rounded-[34px] p-4 sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_28%)]" />

      <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172a]/70">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {partnerName}
            </span>
            <span className="text-xs text-slate-400">{partnerStatus}</span>
          </div>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`h-full min-h-[520px] w-full object-cover ${
            hasRemoteTracks ? "block" : "hidden"
          }`}
        />

        {!hasRemoteTracks && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/5 text-cyan-300">
              <MonitorSmartphone size={34} />
            </div>
            <div className="mt-5 text-2xl font-bold tracking-tight text-white">
              Stranger video stream
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              The remote partner’s live camera stream will render in this area
              once the peer connection is attached.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}