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

  // Fetch the absolute newest user data directly from the DB with associated profiles
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: {
        include: {
          skills: true,
          certificates: true,
          projects: true,
          education: true,
          experience: true,
        }
      },
      recruiterProfile: true,
    }
  });

  if (!user) redirect("/login");

  const student = user.studentProfile;
  const initialSkills = student?.skills?.map(s => s.name) || [];
  
  const initialCertificates = (student?.certificates || []).map(cert => ({
    ...cert,
    url: cert.url || "",
    proofUrl: cert.proofUrl || "",
    year: cert.year || ""
  }));

  const initialProjects = (student?.projects || []).map(p => ({
    ...p,
    description: p.description || "",
    url: p.url || ""
  }));

  const initialEducation = (student?.education || []).map(e => ({
    ...e,
    gpa: e.gpa || ""
  }));

  const initialExperience = (student?.experience || []).map(exp => ({
    ...exp,
    description: exp.description || ""
  }));

  const initialAchievements = student?.achievements || [];
  const initialPreferences = student?.preferences as any || null;
  const initialCompany = user.recruiterProfile?.company || "";
  const role = user.role;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-black border border-white/10 shadow-2xl shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform cursor-default">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white">Profile Settings</h1>
              <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {user.email} • {role === 'RECRUITER' ? 'Recruiter' : 'Student'} Profile
              </p>
            </div>
          </div>
          <Link href="/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 rounded-2xl transition-all active:scale-95 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Dashboard
          </Link>
        </header>

        <main className="relative">
          {/* Background Decorative Blur */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <ProfileForm 
            initialName={user.name || ''} 
            initialEmail={user.email}
            role={role}
            initialBio={student?.bio || ''}
            initialCompany={initialCompany}
            initialSkills={initialSkills}
            initialResumeUrl={student?.resumeUrl || ''}
            initialCertificates={initialCertificates}
            initialProjects={initialProjects}
            initialEducation={initialEducation}
            initialExperience={initialExperience}
            initialAchievements={initialAchievements}
            initialPreferences={initialPreferences}
            initialSocials={{
              github: user.githubUrl || '',
              linkedin: user.linkedinUrl || '',
              twitter: user.twitterUrl || ''
            }}
          />
        </main>
        
        <footer className="pt-10 border-t border-white/5 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">
          SkillBridge Registry • Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </footer>
      </div>
    </div>
  );
}
