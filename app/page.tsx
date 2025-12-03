import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "ADMIN") {
    redirect("/admin");
  }
  if (session?.user.role === "CLUB") {
    redirect("/club");
  }
  if (session?.user.role === "ATHLETE") {
    redirect("/athlete");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="relative isolate">
        <div className="absolute inset-0 bg-[url('/hero-bg.svg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Kwale Sports Excellence
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Performance analytics for clubs and athletes in Kwale
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Track progress, capture key metrics, and unlock personalized feedback for every athlete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-md bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              Sign in
            </Link>
            <a
              href="#roles"
              className="px-6 py-3 rounded-md border border-slate-700 text-slate-300 font-medium hover:border-slate-600 transition"
            >
              Explore roles
            </a>
          </div>
        </div>
      </header>

      <main id="roles" className="max-w-5xl mx-auto px-4 py-20 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold">Built for every role</h2>
          <p className="text-slate-400">
            Admins oversee clubs, clubs manage athletes, athletes see their progress.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold">A</span>
            </div>
            <h3 className="text-lg font-semibold">Admin</h3>
            <p className="text-sm text-slate-400">
              Register clubs, approve or reject applications, and view overall system stats.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <span className="text-sky-400 font-bold">C</span>
            </div>
            <h3 className="text-lg font-semibold">Club</h3>
            <p className="text-sm text-slate-400">
              Register athletes, record performance metrics, and monitor athlete trends.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 font-bold">A</span>
            </div>
            <h3 className="text-lg font-semibold">Athlete</h3>
            <p className="text-sm text-slate-400">
              View your performance graph and receive customized feedback based on trends.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
