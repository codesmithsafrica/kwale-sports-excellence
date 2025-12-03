"use client";

import { useState } from "react";

export function ApproveClubForm({ clubId }: { clubId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    await fetch("/api/clubs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId, status: "APPROVED" }),
    });
    location.reload();
  }

  async function handleReject() {
    setLoading(true);
    await fetch("/api/clubs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId, status: "REJECTED" }),
    });
    location.reload();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-500 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
