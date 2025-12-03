"use client";

import { useState } from "react";

export function CreateClubForm() {
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
      setError(data.error || "Failed to create club");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setClubName("");
      setEmail("");
      setPassword("");
      setSuccess(false);
    }, 2000);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-emerald-400 text-sm">Club created successfully!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-100">Create a new club</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          placeholder="Club name"
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
          required
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-500 text-slate-950 font-semibold py-2 text-sm hover:bg-emerald-400 transition disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create club"}
        </button>
      </form>
    </div>
  );
}
