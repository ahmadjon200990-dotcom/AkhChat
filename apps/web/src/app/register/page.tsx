"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const REGIONS = [
  "Toshkent",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg‘ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog‘iston",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("akhchat-user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNickname(parsed.nickname || "");
        setAge(parsed.age ? String(parsed.age) : "");
        setRegion(parsed.region || "");
      } catch {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      alert("Avval Google orqali ro‘yxatdan o‘ting");
      return;
    }

    const cleanName = nickname.trim();
    const cleanAge = Number(age);

    if (!cleanName || !cleanAge || !region) {
      alert("Ism, yosh va viloyatni to‘ldiring");
      return;
    }

    localStorage.setItem(
      "akhchat-user",
      JSON.stringify({
        nickname: cleanName,
        age: cleanAge,
        region,
        email: session.user.email,
        image: session.user.image,
        googleName: session.user.name,
      })
    );

    router.push("/chat");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-lg">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-black">Ro‘yxatdan o‘tish</h1>
            <p className="mt-2 text-sm text-black/60">
              Google orqali kiring va profilingizni to‘ldiring.
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white text-base font-semibold text-black transition hover:bg-black/[0.03]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-6 w-6"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.169 35.091 26.715 36 24 36c-5.173 0-9.625-3.327-11.287-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-1.057 3.002-3.18 5.47-6.084 6.57l.003-.002 6.19 5.238C35.001 39.935 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            {status === "authenticated"
              ? "Google ulandi"
              : "Google bilan kirish"}
          </button>

          {status === "authenticated" && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {session.user?.name || "Google foydalanuvchi"} ulandi
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">
                Ismingiz
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Masalan: Ahmad"
                className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 text-black outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">
                Yoshingiz
              </label>
              <input
                type="number"
                min={10}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Masalan: 16"
                className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 text-black outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">
                Viloyatingiz
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-14 w-full rounded-2xl border border-black/10 bg-white px-4 text-black outline-none transition focus:border-yellow-500"
              >
                <option value="">Viloyatni tanlang</option>
                {REGIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 h-14 w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-base font-bold text-white transition hover:opacity-95"
            >
              Davom etish
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}