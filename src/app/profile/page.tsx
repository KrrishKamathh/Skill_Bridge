import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Fetch the absolute newest user data directly from the DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto pt-10">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Your Profile</h1>
            <p className="text-slate-400 mt-1">Manage your account settings</p>
          </div>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 rounded-xl transition-all">
            Back to Dashboard
          </Link>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 backdrop-blur-sm relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="mb-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-bold border-4 border-slate-950 shadow-xl text-white">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name || 'Anonymous User'}</h2>
              <p className="text-slate-400 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h3 className="text-lg font-medium text-white mb-6">Edit Profile Details</h3>
            <ProfileForm initialName={user.name || ''} />
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          SkillBridge Member since {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
