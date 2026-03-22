import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import InteractiveButton from "@/app/components/InteractiveButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const userRole = (session.user as any)?.role || "STUDENT";

  // Fetch data for matching
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: {
        include: { skills: true }
      }
    }
  });

  const jobs = await prisma.job.findMany({
    include: { 
      skills: true,
      recruiter: true 
    }
  });

  const userSkills = user?.studentProfile?.skills?.map(s => s.name.toLowerCase()) || [];

  const matchedJobs = jobs.map(job => {
    const jobSkills = job.skills.map(s => s.name.toLowerCase());
    const commonSkills = jobSkills.filter(s => userSkills.includes(s));
    const missingSkills = jobSkills.filter(s => !userSkills.includes(s));
    const matchPercentage = jobSkills.length > 0 
      ? Math.round((commonSkills.length / jobSkills.length) * 100) 
      : 0;

    return {
      ...job,
      matchPercentage,
      missingSkills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="min-h-screen bg-[#000308] text-slate-50 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white italic">
              Skill<span className="text-blue-500">Bridge</span>
            </h1>
            <p className="text-slate-400 mt-1 italic">
              Welcome back, <span className="text-white font-semibold">{session.user?.name || session.user?.email}</span> ({userRole})
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/profile">
              <InteractiveButton variant="secondary">
                Edit Profile
              </InteractiveButton>
            </Link>
            <Link href="/api/auth/signout">
              <InteractiveButton variant="danger">
                Sign Out
              </InteractiveButton>
            </Link>
          </div>
        </header>

        {userRole === "RECRUITER" ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Recruiter specific cards */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
              <h2 className="text-xl font-semibold mb-3 text-white">Active Job Postings</h2>
              <div className="flex flex-col items-center justify-center py-10 text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
                <p>No active jobs yet.</p>
                <Link href="/jobs/new" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                  Post Your First Job
                </Link>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
              <h2 className="text-xl font-semibold mb-3 text-white">AI Candidate Screening</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Automated summarization will appear here as soon as candidates apply to your jobs.
              </p>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 italic text-xs text-slate-500">
                Tip: Our AI filters skills, not just keywords.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Student specific cards */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">AI Matched</span>
              </div>
              
              <div className="space-y-4">
                {matchedJobs.length > 0 ? matchedJobs.map(job => (
                  <div key={job.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 group/item">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-white group-hover/item:text-blue-400 transition-colors">{job.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            job.matchPercentage > 70 ? 'bg-green-500/20 text-green-400' : 
                            job.matchPercentage > 40 ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {job.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{job.recruiter.company} • {job.location} • {job.salary}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map(skill => {
                            const isMatch = userSkills.includes(skill.name.toLowerCase());
                            return (
                              <span 
                                key={skill.id} 
                                className={`text-[10px] px-2 py-0.5 rounded-md border ${
                                  isMatch 
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' 
                                    : 'bg-slate-500/10 border-white/5 text-slate-500'
                                }`}
                              >
                                {skill.name}
                              </span>
                            );
                          })}
                        </div>

                        {job.missingSkills.length > 0 && job.matchPercentage < 100 && (
                          <p className="text-[10px] text-amber-400/80 mt-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Gap: Consider learning <strong>{job.missingSkills[0].toUpperCase()}</strong>
                          </p>
                        )}
                      </div>
                      <InteractiveButton variant="primary">
                        Apply Now
                      </InteractiveButton>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-500 italic">
                    No jobs matching your profile yet. Add more skills to see recommendations!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full group-hover:bg-green-500/20 transition-all duration-500" />
              <h2 className="text-xl font-semibold mb-3 text-white">Learning Roadmap</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Based on your dream job as a <strong>Product Designer</strong>, we recommend:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm font-medium text-white">Master Figma Auto-Layout</p>
                    <p className="text-xs text-slate-500">Free Course • YouTube</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start opacity-70">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-slate-500">2</div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Accessibility in Web Design</p>
                    <p className="text-xs text-slate-600">Paid • Coursera</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
