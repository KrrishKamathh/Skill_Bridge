import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

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

    if (!student || !process.env.GEMINI_API_KEY) {
      // Fallback: If no student profile or no API key, return all jobs
      return NextResponse.json(jobs);
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

      // Map the jobs and attach their real AI match scores
      const jobsWithScores = jobs.map(job => {
        const score = matchedJobScores[job.id] !== undefined ? matchedJobScores[job.id] : 50;
        return { ...job, aiMatchScore: score };
      });

      // Filter out jobs with match scores < 40 so the student only sees relevant jobs
      const matchedJobs = jobsWithScores.filter(job => job.aiMatchScore >= 40);

      // Sort by match score descending so their best matches are always at the top!
      matchedJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

      return NextResponse.json(matchedJobs);
      
    } catch (aiError) {
      console.error("AI Matching Error:", aiError);
      // Fallback: Return all jobs with a default mock score if AI fails
      const fallbackJobs = jobs.map(job => ({ ...job, aiMatchScore: 85 }));
      return NextResponse.json(fallbackJobs);
    }

  } catch (error) {
    console.error("Error fetching marketplace:", error);
    return NextResponse.json({ message: "Error fetching marketplace" }, { status: 500 });
  }
}
