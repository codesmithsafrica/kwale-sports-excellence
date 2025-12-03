import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApproveClubForm } from "@/components/ApproveClubForm";
import { CreateClubForm } from "@/components/CreateClubForm";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const [clubCount, pendingClubs, athleteCount, clubs] = await Promise.all([
    prisma.club.count(),
    prisma.club.count({ where: { status: "PENDING" } }),
    prisma.athlete.count(),
    prisma.club.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Kwale Sports Excellence
            </p>
            <h1 className="text-lg font-semibold">Admin Control Center</h1>
          </div>
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Total Clubs</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{clubCount}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Pending Clubs</p>
            <p className="mt-2 text-2xl font-semibold text-amber-400">{pendingClubs}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Registered Athletes</p>
            <p className="mt-2 text-2xl font-semibold text-sky-400">{athleteCount}</p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">Clubs</h2>
            <p className="text-xs text-slate-500">Approval & oversight</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400 text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Club</th>
                  <th className="px-4 py-2 text-left">Owner Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Created</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club.id} className="border-t border-slate-800/60">
                    <td className="px-4 py-2">{club.name}</td>
                    <td className="px-4 py-2 text-slate-400">{club.owner.email}</td>
                    <td className="px-4 py-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-slate-800 text-slate-200"
                      >
                        {club.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-slate-500">
                      {new Date(club.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {club.status === "PENDING" && <ApproveClubForm clubId={club.id} />}
                    </td>
                  </tr>
                ))}
                {clubs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-xs text-slate-500"
                    >
                      No clubs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">Create a Club</h2>
          <CreateClubForm />
        </section>
      </div>
    </main>
  );
}
