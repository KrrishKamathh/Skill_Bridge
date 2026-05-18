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
      Projects: ${student.projects.map(p => p.title + ' - ' + p.description).join(', ') || 'None'}
      College: ${student.college || 'None'}
    `;

    const jobListings = jobs.map(job => 
      `ID: ${job.id} | Title: ${job.title} | Type: ${job.jobType} | Req: ${job.requirements || ''} | Salary: ${job.salary || ''} | Desc: ${job.description || ''}`
    ).join('\n');

    const prompt = `
      You are an expert AI recruitment engine. Your task is to semantically match a student's profile against a list of job postings. 
      You must ONLY return the IDs of the jobs that are a good semantic match for the student's skills, background, and projects. 
      For example, do NOT match a mechanical engineering job to a data analyst student. Be reasonably generous but filter out obvious mismatches.
      
      Student Profile:
      ${studentInfo}
      
      Job Postings:
      ${jobListings}
      
      Return ONLY a JSON array of strings containing the matched job IDs. Do NOT include markdown blocks like \`\`\`json. Just the array like ["id1", "id2"]. If no jobs match, return [].
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || "[]";
      // Clean up markdown just in case the AI includes it despite instructions
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const matchedJobIds: string[] = JSON.parse(cleanedText);

      // Filter jobs based on AI response
      const matchedJobs = jobs.filter(job => matchedJobIds.includes(job.id));
      
      // If AI matched nothing but there are jobs, it might be too strict or failed. 
      // Depending on requirements, we can return empty or fallback to all. Let's return empty.
      return NextResponse.json(matchedJobs);
      
    } catch (aiError) {
      console.error("AI Matching Error:", aiError);
      // Fallback to all jobs if AI fails
      return NextResponse.json(jobs);
    }

  } catch (error) {
    console.error("Error fetching marketplace:", error);
    return NextResponse.json({ message: "Error fetching marketplace" }, { status: 500 });
  }
}
