"use client";

import { useState } from "react";

export function AddAthleteForm({ clubId }: { clubId: string }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/athletes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to add athlete");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setName("");
      setSuccess(false);
      location.reload();
    }, 1000);
  }

  if (success) {
    return (
      <p className="text-emerald-400 text-xs">Athlete added!</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Athlete name"
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-500 text-slate-950 font-semibold py-2 text-sm hover:bg-emerald-400 transition disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add athlete"}
      </button>
    </form>
  );
}
