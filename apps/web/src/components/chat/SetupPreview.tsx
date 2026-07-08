"use client";

import { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

type SetupPreviewProps = {
  stream: MediaStream | null;
  status: "idle" | "requesting" | "ready" | "error";
};

export default function SetupPreview({
  stream,
  status,
}: SetupPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  if (status !== "ready" || !stream) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[22px] bg-white/[0.03]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 text-cyan-300">
            <Camera size={28} />
          </div>
          <div className="mt-4 text-lg font-semibold text-white">
            Camera preview placeholder
          </div>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Allow camera and microphone access to see your live preview here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-[220px] w-full object-cover"
      />
    </div>
  );
}