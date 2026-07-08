"use client";

import { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

type LocalVideoProps = {
  label?: string;
  live?: boolean;
  stream?: MediaStream | null;
};

export default function LocalVideo({
  label = "You",
  live = true,
  stream = null,
}: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="w-[180px] rounded-[24px] border border-white/10 bg-black/40 p-3 shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            live
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border border-slate-500/20 bg-slate-500/10 text-slate-300"
          }`}
        >
          {live ? "Live" : "Off"}
        </span>
      </div>

      <div className="overflow-hidden rounded-[18px] bg-white/[0.04]">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-[120px] w-full object-cover"
          />
        ) : (
          <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <Camera size={18} className="text-slate-500" />
              <span>Local camera preview</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}