import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import prisma from "@/lib/prisma";
import { ArrowLeft, Shield } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: {
        include: {
          projects: true,
        }
      },
      recruiterProfile: true,
    }
  });

  if (!user) redirect("/login");

  const student = user.studentProfile;
  const initialSkills: string[] = [];
  const initialCertificates: any[] = [];
  const initialProjects = (student?.projects || []).map(p => ({
    ...p,
    description: p.description || "",
    url: (p as any).githubUrl || ""
  }));

  const initialEducation: any[] = [];
  const initialExperience: any[] = [];
  const initialAchievements: string[] = [];
  const initialPreferences = null;
  const initialCompany = user.recruiterProfile?.companyName || "";
  const role = user.role;

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#2d2013] selection:bg-[#cb4b16]/20 relative overflow-x-hidden p-6 md:p-12 lg:p-16">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#cb4b16]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-16">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#7a6040] hover:text-[#2d2013] transition-colors font-bold text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#cb4b16] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#fdf6e3] rounded-full" />
            </div>
            <span className="font-bold text-sm tracking-tighter uppercase font-black">SkillBridge Registry</span>
          </div>
        </header>

        <div className="mb-20 flex flex-col md:flex-row items-start md:items-end gap-10">
          <div className="w-32 h-32 rounded-[2.5rem] bg-[#2d2013] text-[#fdf6e3] flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-white">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">Settings <span className="text-[#cb4b16]">&amp;</span> Identity</h1>
            <div className="flex flex-wrap items-center gap-4 text-[#7a6040] font-bold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#2aa198]" /> {user.email}</span>
              <span className="w-1 h-1 bg-[#cfc3a0] rounded-full" />
              <span>{role} Profile</span>
              <span className="w-1 h-1 bg-[#cfc3a0] rounded-full" />
              <span>Member since {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <main>
          <ProfileForm 
            initialName={user.name || ''} 
            initialEmail={user.email || ''}
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
        
        <footer className="mt-32 pt-12 border-t border-[#cfc3a0] text-center">
          <p className="text-[10px] text-[#b5a080] font-black uppercase tracking-[0.4em]">
            Verified SkillBridge Professional Identity • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
