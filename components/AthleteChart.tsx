"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Athlete {
  id: string;
  name: string;
  metrics: { id: string; date: Date; metricType: string; value: number }[];
}

export function AthleteChart({ athletes }: { athletes: Athlete[] }) {
  if (!athletes.length) return <p className="text-xs text-slate-500">No athletes to display.</p>;

  const first = athletes[0];
  const labels = first.metrics.map((m) => new Date(m.date).toLocaleDateString());
  const values = first.metrics.map((m) => m.value);

  const data = {
    labels,
    datasets: [
      {
        label: first.name,
        data: values,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="relative h-64">
      <Line data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } }} />
    </div>
  );
}
