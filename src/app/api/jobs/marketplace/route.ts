import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

function calculateHybridMatchScore(student: any, job: any): number {
  const studentText = `${student.bio || ''} ${student.school || ''} ${student.college || ''} ${student.achievements || ''} ${student.projects?.map((p: any) => p.title + ' ' + p.description).join(' ') || ''}`.toLowerCase();
  const jobText = `${job.title} ${job.requirements || ''} ${job.description || ''}`.toLowerCase();

  const isFinanceStudent = studentText.includes('finance') || studentText.includes('commerce') || studentText.includes('accounting') || studentText.includes('bcom') || studentText.includes('cfa');
  const isDesignJob = jobText.includes('design') || jobText.includes('figma') || jobText.includes('photoshop') || jobText.includes('illustrator') || jobText.includes('graphic') || jobText.includes('ui/ux');

  // Hard career path mismatch check: Finance student with zero design projects/skills
  if (isFinanceStudent && isDesignJob) {
    const hasDesignSkill = studentText.includes('design') || studentText.includes('figma') || studentText.includes('photoshop') || studentText.includes('illustrator') || studentText.includes('ui/ux');
    if (!hasDesignSkill) return 15; // Obvious mismatch
  }

  // Tech job mismatch check: Finance student with zero coding skills
  const isTechJob = jobText.includes('developer') || jobText.includes('engineer') || jobText.includes('software') || jobText.includes('react') || jobText.includes('coding');
  if (isFinanceStudent && isTechJob) {
    const hasTechSkill = studentText.includes('coding') || studentText.includes('developer') || studentText.includes('react') || studentText.includes('python') || studentText.includes('javascript') || studentText.includes('btech');
    if (!hasTechSkill) return 20; // Obvious mismatch
  }

  return 85; // Default fallback score if everything matches well
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        recruiterProfile: {
          select: {
            companyName: true,
          }
        },
        applications: {
          where: { userId: (session.user as any).id },
          select: { id: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Fetch the student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: (session.user as any).id },
      include: { projects: true }
    });

    if (!student) {
      return NextResponse.json(jobs);
    }

    // 1. Calculate deterministic matching first (safeguard)
    const jobsWithScores = jobs.map(job => {
      const score = calculateHybridMatchScore(student, job);
      return { ...job, aiMatchScore: score };
    });

    // If Gemini key is not present, use the deterministic hybrid matching directly
    if (!process.env.GEMINI_API_KEY) {
      const matchedJobs = jobsWithScores.filter(job => job.aiMatchScore >= 40);
      matchedJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
      return NextResponse.json(matchedJobs);
    }

    // Prepare prompt for AI Semantic Matching
    const studentInfo = `
      Bio: ${student.bio || 'None'}
      Achievements: ${student.achievements || 'None'}
      Schooling/Background: ${student.school || 'None'}
      College/Degree: ${student.college || 'None'}
      Projects/Achievements: ${student.projects.map(p => p.title + ' - ' + p.description + (p.evidenceLink ? ' (Verified Certificate Proof attached)' : '')).join(', ') || 'None'}
    `;

    const jobListings = jobs.map(job => 
      `ID: ${job.id} | Title: ${job.title} | Type: ${job.jobType} | Req: ${job.requirements || ''} | Salary: ${job.salary || ''} | Desc: ${job.description || ''}`
    ).join('\n');

    const prompt = `
      You are an expert AI talent acquisition engine. Your job is to semantically compare a student's academic background, bio, projects, and achievements against a list of active job postings.
      For each job, evaluate how well the student's credentials fit the job title, required tech stack/tools, and job description.
      
      CRITICAL MATCHING RULES:
      1. Obvious career path mismatches (e.g., matching a Graphic Designer or UI/UX role to a student who has a strictly Commerce/Finance background with zero design projects, or matching a Software Engineer role to a Mechanical/Civil background with no coding projects) MUST receive a match score under 30%.
      2. If a student's profile is empty, thin, or generic, do NOT give them a high score. They must receive a low match score (under 40%).
      3. A strong match (e.g., a student with React projects matching a Frontend React developer role) should receive a high score (80% to 98%).
      4. A medium match (some transferable skills or projects) should receive 40% to 79%.
      
      Student Profile:
      ${studentInfo}
      
      Job Postings:
      ${jobListings}
      
      Return ONLY a JSON object mapping each job ID to an integer percentage score (0 to 100). Do NOT write any markdown blocks like \`\`\`json. Just return a raw JSON object. If no jobs match or exist, return {}.
      
      Example return format:
      {
        "job_id_1": 87,
        "job_id_2": 15
      }
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || "{}";
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const matchedJobScores: Record<string, number> = JSON.parse(cleanedText);

      // Merge Gemini AI scores with deterministic hybrid safeguards
      const mergedJobs = jobs.map(job => {
        let score = matchedJobScores[job.id] !== undefined ? matchedJobScores[job.id] : 50;
        
        // Safeguard check: If hybrid algorithm says it's a mismatch (score <= 30), override to mismatch
        const safeguardScore = calculateHybridMatchScore(student, job);
        if (safeguardScore <= 30) {
          score = safeguardScore;
        }

        return { ...job, aiMatchScore: score };
      });

      // Filter out jobs with match scores < 40 so the student only sees relevant jobs
      const matchedJobs = mergedJobs.filter(job => job.aiMatchScore >= 40);

      // Sort by match score descending
      matchedJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      return NextResponse.json(matchedJobs);
      
    } catch (aiError) {
      console.error("AI Matching Error:", aiError);
      // Fallback: If Gemini API fails/times out, use the safe hybrid calculations
      const matchedJobs = jobsWithScores.filter(job => job.aiMatchScore >= 40);
      matchedJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
      return NextResponse.json(matchedJobs);
    }

  } catch (error) {
    console.error("Error fetching marketplace:", error);
    return NextResponse.json({ message: "Error fetching marketplace" }, { status: 500 });
  }
}
