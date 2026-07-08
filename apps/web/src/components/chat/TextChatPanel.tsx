import { MessageSquareText } from "lucide-react";

const chatMessages = [
  { from: "partner", text: "Hey! Where are you from?" },
  { from: "me", text: "Hi, I’m from Uzbekistan. You?" },
  { from: "partner", text: "Nice. I’m from Turkey 👋" },
];

export default function TextChatPanel() {
  return (
    <section className="card rounded-[32px] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-300">
          <MessageSquareText size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Live text chat
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Side chat panel for the current session
          </p>
        </div>
      </div>

      <div className="mt-6 flex min-h-[420px] flex-col rounded-[28px] border border-white/10 bg-[#0f172a]/55 p-4">
        <div className="flex-1 space-y-3 overflow-hidden">
          {chatMessages.map((message, index) => {
            const isMe = message.from === "me";

            return (
              <div
                key={`${message.from}-${index}`}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-7 ${
                    isMe
                      ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Write a message..."
            className="input"
          />
          <button className="primary-btn shrink-0 px-5">Send</button>
        </div>
      </div>
    </section>
  );
}