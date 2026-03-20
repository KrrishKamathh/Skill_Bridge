import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">SkillBridge Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {session.user?.name || session.user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/profile" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 rounded-xl transition-all">
              Edit Profile
            </Link>
            <Link href="/api/auth/signout" className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium border border-red-500/20 rounded-xl transition-all">
              Sign Out
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
            <h2 className="text-xl font-semibold mb-3 text-white">Authentication Status</h2>
            <div className="flex items-center gap-3 text-green-400 font-medium bg-green-500/10 w-fit px-4 py-2 rounded-lg border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure Session Active
            </div>
            <p className="text-slate-400 mt-4 leading-relaxed">
              You are officially logged in using <strong>NextAuth</strong> with a genuine <strong>Prisma + SQLite</strong> backend connection.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
            <h2 className="text-xl font-semibold mb-3 text-white">Next Steps</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-blue-400">→</span> Add user profiles and avatars
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400">→</span> Build out course listings
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400">→</span> Connect an email server for password resets
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
