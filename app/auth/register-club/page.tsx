"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClubPage() {
  const router = useRouter();

  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubName, email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to register club");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/auth/login"), 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="text-emerald-400 text-lg">Club registered!</p>
          <p className="text-sm text-slate-400">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-emerald-500/20 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Kwale Sports Excellence
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Register your club</h1>
          <p className="text-sm text-slate-400">
            Your club will be created and await admin approval.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">Club name</label>
            <input
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">Admin email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-500 text-slate-950 font-semibold py-2 text-sm hover:bg-emerald-400 transition disabled:opacity-60"
          >
            {loading ? "Registering…" : "Register club"}
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center">
          <a href="/auth/login" className="text-emerald-400 hover:underline">Back to sign in</a>
        </p>
      </div>
    </div>
  );
}
