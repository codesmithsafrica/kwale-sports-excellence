"use client";

import { useState } from "react";

interface Athlete {
  id: string;
  name: string;
}

export function AddMetricForm({ athletes }: { athletes: Athlete[] }) {
  const [athleteId, setAthleteId] = useState("");
  const [metricType, setMetricType] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId, metricType, value: Number(value), date }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to add metric");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setAthleteId("");
      setMetricType("");
      setValue("");
      setSuccess(false);
      location.reload();
    }, 1000);
  }

  if (success) {
    return (
      <p className="text-emerald-400 text-xs">Metric added!</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <select
        value={athleteId}
        onChange={(e) => setAthleteId(e.target.value)}
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        required
      >
        <option value="">Select athlete</option>
        {athletes.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <input
        value={metricType}
        onChange={(e) => setMetricType(e.target.value)}
        placeholder="Metric type (e.g. Speed, Endurance)"
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        required
      />
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-500 text-slate-950 font-semibold py-2 text-sm hover:bg-emerald-400 transition disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add metric"}
      </button>
    </form>
  );
}
