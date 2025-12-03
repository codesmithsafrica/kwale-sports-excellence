import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddAthleteForm } from "@/components/AddAthleteForm";
import { AddMetricForm } from "@/components/AddMetricForm";
import { AthleteChart } from "@/components/AthleteChart";

export default async function ClubDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLUB") {
    redirect("/auth/login");
  }

  const club = await prisma.club.findFirst({
    where: { ownerId: session.user.id },
    include: {
      athletes: {
        include: {
          metrics: true,
        },
      },
    },
  });

  if (!club) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">
          No club record found. Contact admin to complete your setup.
        </p>
      </main>
    );
  }

  const athleteCount = club.athletes.length;
  const metricCount = club.athletes.reduce((acc, a) => acc + a.metrics.length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-emerald-600/40 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Club Dashboard
            </p>
            <h1 className="text-lg font-semibold">{club.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Status</p>
            <p className="text-xs font-medium text-emerald-400">{club.status}</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/40 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">Athletes</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{athleteCount}</p>
          </div>
          <div className="rounded-xl border border-sky-500/40 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">Performance entries</p>
            <p className="mt-2 text-2xl font-semibold text-sky-400">{metricCount}</p>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-400">Status</p>
            <p className="mt-2 text-sm font-semibold text-amber-300">{club.status}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Athletes</h2>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <AddAthleteForm clubId={club.id} />
              <div className="max-h-64 overflow-y-auto space-y-2 text-sm">
                {club.athletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{athlete.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Metrics: {athlete.metrics.length}
                      </p>
                    </div>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300">
                      View performance
                    </button>
                  </div>
                ))}
                {club.athletes.length === 0 && (
                  <p className="text-xs text-slate-500">
                    No athletes yet. Add one above.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Performance metrics</h2>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <AddMetricForm athletes={club.athletes} />
              <div className="max-h-64 overflow-y-auto space-y-2 text-sm">
                {club.athletes.flatMap((athlete) =>
                  athlete.metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="rounded-lg border border-slate-800/70 bg-slate-900/80 px-3 py-2"
                    >
                      <p className="font-medium text-slate-100">{athlete.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {metric.metricType}: {metric.value} on{" "}
                        {new Date(metric.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
                {metricCount === 0 && (
                  <p className="text-xs text-slate-500">
                    No metrics yet. Add one above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {club.athletes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Performance chart</h2>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <AthleteChart athletes={club.athletes} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
