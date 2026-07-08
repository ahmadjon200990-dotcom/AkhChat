"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Mic,
  MonitorUp,
  SkipForward,
  PhoneOff,
  Video,
  MicOff,
  CameraOff,
} from "lucide-react";
import { getSocket } from "@/lib/socket";

type StoredUser = {
  nickname: string;
  age: number;
  region: string;
};

type PartnerUser = {
  socketId?: string;
  nickname: string;
  age?: number;
  region?: string;
};

type MatchFoundPayload = {
  partner: PartnerUser;
  isInitiator: boolean;
};

export default function ChatPage() {
  const [me, setMe] = useState<StoredUser | null>(null);
  const [partner, setPartner] = useState<PartnerUser | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("akhchat-user");

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredUser;
        setMe(parsed);
      } catch {
        localStorage.removeItem("akhchat-user");
      }
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const onMatchFound = (payload: MatchFoundPayload) => {
      console.log("match found:", payload);
      setPartner(payload.partner);
      setIsSearching(false);
    };

    const onPeerDisconnected = () => {
      console.log("peer disconnected");
      setPartner(null);
      setIsSearching(false);
    };

    socket.on("match:found", onMatchFound);
    socket.on("peer:disconnected", onPeerDisconnected);

    return () => {
      socket.off("match:found", onMatchFound);
      socket.off("peer:disconnected", onPeerDisconnected);
    };
  }, []);

  const handleFindPartner = () => {
    if (!me) {
      alert("Avval ro‘yxatdan o‘ting");
      return;
    }

    const socket = getSocket();

    setPartner(null);
    setIsSearching(true);

    socket.emit("match:find", {
      nickname: me.nickname,
      age: me.age,
      region: me.region,
    });
  };

  const myInfo = useMemo(() => {
    if (!me) return "Ro‘yxatdan o‘tmagansiz";
    return `${me.nickname}, ${me.age} — ${me.region}`;
  }, [me]);

  const partnerInfo = useMemo(() => {
    if (isSearching) return "Suhbatdosh qidirilmoqda...";
    if (!partner) return "Hozircha suhbatdosh yo‘q";
    return `${partner.nickname}${partner.age ? `, ${partner.age}` : ""}${
      partner.region ? ` — ${partner.region}` : ""
    }`;
  }, [partner, isSearching]);

  const handleNext = () => {
    handleFindPartner();
  };

  const handleEnd = () => {
    const socket = getSocket();
    socket.emit("match:leave");
    setPartner(null);
    setIsSearching(false);
  };

  const handleFullscreen = () => {
    if (typeof document === "undefined") return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#f7f7f8] text-black">
      <div className="mx-auto flex h-full max-w-[1700px] flex-col px-3 py-3 sm:px-4 sm:py-4">
        <div className="mb-3 flex items-center justify-between rounded-[24px] border border-black/10 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg">
              <Video size={22} />
            </div>

            <div>
              <div className="text-xl font-black leading-none sm:text-2xl">
                AkhChat
              </div>
              <div className="mt-1 text-xs text-black/50 sm:text-sm">
                Jonli video chat
              </div>
            </div>
          </div>

          <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700 sm:text-sm">
            Online
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-white to-[#fff2e8]">
            <div className="flex h-full w-full items-center justify-center p-4 sm:p-6">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-inner">
                <div className="absolute left-4 top-4 z-20 rounded-2xl bg-white/90 px-4 py-3 shadow-md backdrop-blur">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                    Suhbatdosh
                  </div>
                  <div className="mt-1 text-sm font-bold sm:text-base">
                    {partnerInfo}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center px-4 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-500 via-orange-400 to-red-500 text-white shadow-xl sm:h-28 sm:w-28">
                    <Camera size={40} />
                  </div>

                  <h2 className="mt-6 text-3xl font-black sm:text-5xl">
                    {partner ? "Suhbat boshlandi" : "Video oynasi"}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-black/45 sm:text-base">
                    {partner
                      ? "Qarshi tomondagi foydalanuvchi topildi."
                      : "Shu joyda suhbatdoshning videosi chiqadi."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 z-30 w-[190px] rounded-[26px] border border-black/10 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:right-6 sm:top-6 sm:w-[230px]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45 sm:text-xs">
                Siz
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700 sm:text-xs">
                Live
              </span>
            </div>

            <div className="flex h-[130px] items-center justify-center rounded-[22px] bg-gradient-to-br from-blue-50 to-orange-50 text-black/45 sm:h-[170px]">
              {cameraOn ? "Kamera preview" : "Kamera o‘chiq"}
            </div>

            <div className="mt-3 rounded-2xl bg-black/[0.04] px-3 py-2 text-xs font-semibold leading-6 text-black/70">
              {myInfo}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white/90 px-3 py-4 backdrop-blur sm:px-4 sm:py-5">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={handleNext}
                className="flex h-14 min-w-[145px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] sm:h-16 sm:min-w-[160px] sm:text-base"
              >
                <SkipForward size={20} />
                {isSearching ? "Qidirilmoqda..." : "Keyingisi"}
              </button>

              <button
                onClick={() => setMicOn((prev) => !prev)}
                className="flex h-14 min-w-[130px] items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold transition hover:bg-black hover:text-white sm:h-16 sm:min-w-[145px] sm:text-base"
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                {micOn ? "Mikrofon" : "Mic off"}
              </button>

              <button
                onClick={() => setCameraOn((prev) => !prev)}
                className="flex h-14 min-w-[130px] items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold transition hover:bg-black hover:text-white sm:h-16 sm:min-w-[145px] sm:text-base"
              >
                {cameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
                {cameraOn ? "Kamera" : "Cam off"}
              </button>

              <button
                onClick={handleFullscreen}
                className="flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold transition hover:bg-black hover:text-white sm:h-16 sm:min-w-[170px] sm:text-base"
              >
                <MonitorUp size={20} />
                To‘liq ekran
              </button>

              <button
                onClick={handleEnd}
                className="flex h-14 min-w-[140px] items-center justify-center gap-3 rounded-2xl bg-red-500 px-5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] sm:h-16 sm:min-w-[150px] sm:text-base"
              >
                <PhoneOff size={20} />
                Tugatish
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}