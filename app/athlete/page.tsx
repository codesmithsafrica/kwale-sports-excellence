import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AthleteChart } from "@/components/AthleteChart";

export default async function AthleteDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ATHLETE") {
    redirect("/auth/login");
  }

  const athlete = await prisma.athlete.findFirst({
    where: { userId: session.user.id },
    include: { club: true, metrics: { orderBy: { date: "asc" } } },
  });

  if (!athlete) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">
          No athlete profile linked to this account yet.
        </p>
      </main>
    );
  }

  const values = athlete.metrics.map((m) => m.value);
  let feedback = "Not enough data yet to generate feedback.";
  if (values.length >= 3) {
    const recent = values.slice(-3);
    const prev = values.slice(-6, -3);

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const recentAvg = avg(recent);
    const prevAvg = prev.length ? avg(prev) : recentAvg;

    const diff = recentAvg - prevAvg;
    const pct = prevAvg ? (diff / prevAvg) * 100 : 0;

    if (pct > 10) {
      feedback =
        "Your recent performance is trending up strongly. Keep your current training load and focus on recovery to sustain gains.";
    } else if (pct < -10) {
      feedback =
        "Your recent performance has dipped. Review sleep, nutrition, and training intensity, and consider a lighter week.";
    } else {
      feedback =
        "Your performance is relatively stable. To keep progressing, introduce small, consistent challenges to your sessions.";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-sky-500/40 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Athlete Dashboard</p>
            <h1 className="text-lg font-semibold">{athlete.name}</h1>
            <p className="text-xs text-slate-400">{athlete.club?.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-sky-500/40 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">Sessions tracked</p>
            <p className="mt-2 text-2xl font-semibold text-sky-400">{athlete.metrics.length}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 items-start">
          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">Performance trend</h2>
            {values.length === 0 ? (
              <p className="text-xs text-slate-500">
                No performance data yet. Ask your club to start recording your metrics.
              </p>
            ) : (
              <AthleteChart athletes={[athlete]} />
            )}
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-slate-950/60 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-100">Coach-style feedback</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{feedback}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
