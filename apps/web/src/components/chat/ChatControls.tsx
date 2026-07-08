import {
  Mic,
  MicOff,
  PhoneOff,
  SkipForward,
  Video,
  VideoOff,
} from "lucide-react";

type ChatControlsProps = {
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onNext: () => void;
  onEnd: () => void;
};

export default function ChatControls({
  isMicEnabled,
  isCameraEnabled,
  onToggleMic,
  onToggleCamera,
  onNext,
  onEnd,
}: ChatControlsProps) {
  return (
    <section className="card rounded-[32px] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Chat controls
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage your microphone, camera, and current conversation actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onToggleMic}
            className="secondary-btn min-w-[120px]"
            type="button"
          >
            {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            {isMicEnabled ? "Mic on" : "Mic off"}
          </button>

          <button
            onClick={onToggleCamera}
            className="secondary-btn min-w-[120px]"
            type="button"
          >
            {isCameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            {isCameraEnabled ? "Camera on" : "Camera off"}
          </button>

          <button
            className="secondary-btn min-w-[120px]"
            type="button"
            onClick={onNext}
          >
            <SkipForward size={18} />
            Next
          </button>

          <button
            type="button"
            onClick={onEnd}
            className="inline-flex min-h-[52px] min-w-[140px] items-center justify-center gap-2 rounded-full bg-gradient-to-br from-rose-600 to-red-500 px-5 font-bold text-white shadow-lg transition hover:opacity-95"
          >
            <PhoneOff size={18} />
            End chat
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button
          onClick={onToggleMic}
          type="button"
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-indigo-400/30 hover:bg-white/[0.05]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-300">
            {isMicEnabled ? <Mic size={22} /> : <MicOff size={22} />}
          </div>
          <div className="mt-4 text-lg font-bold tracking-tight text-white">
            {isMicEnabled ? "Mute microphone" : "Unmute microphone"}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Toggle your microphone during the conversation.
          </p>
        </button>

        <button
          onClick={onToggleCamera}
          type="button"
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-indigo-400/30 hover:bg-white/[0.05]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
            {isCameraEnabled ? <Video size={22} /> : <VideoOff size={22} />}
          </div>
          <div className="mt-4 text-lg font-bold tracking-tight text-white">
            {isCameraEnabled ? "Hide camera" : "Show camera"}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Toggle your video feed while keeping the session active.
          </p>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-indigo-400/30 hover:bg-white/[0.05]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            <SkipForward size={22} />
          </div>
          <div className="mt-4 text-lg font-bold tracking-tight text-white">
            Skip partner
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Leave the current match and instantly connect to the next user.
          </p>
        </button>

        <button
          type="button"
          onClick={onEnd}
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-red-400/30 hover:bg-white/[0.05]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
            <PhoneOff size={22} />
          </div>
          <div className="mt-4 text-lg font-bold tracking-tight text-white">
            End conversation
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Close the current chat session and return safely.
          </p>
        </button>
      </div>
    </section>
  );
}