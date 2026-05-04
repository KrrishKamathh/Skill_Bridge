import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const userId = session.user.id;
    const userRole = session.user.role;

    if (userRole === "STUDENT") {
      await prisma.studentProfile.upsert({
        where: { userId },
        update: {
          dob: data.dob ? new Date(data.dob) : undefined,
          school: data.school,
          college: data.college,
          achievements: data.achievements,
        },
        create: {
          userId,
          dob: data.dob ? new Date(data.dob) : undefined,
          school: data.school,
          college: data.college,
          achievements: data.achievements,
        },
      });

      // Handle projects if any were provided
      if (data.projects && data.projects.length > 0) {
        for (const project of data.projects) {
          await prisma.project.create({
            data: {
              studentProfile: { connect: { userId } },
              title: project.title,
              description: project.description,
              githubUrl: project.githubUrl,
              liveUrl: project.liveUrl,
              evidenceLink: project.evidenceLink,
            },
          });
        }
      }
    } else if (userRole === "RECRUITER") {
      // 1. Update user private data (Owner only)
      await prisma.user.update({
        where: { id: userId },
        data: {
          privatePhone: data.privatePhone,
          idVerification: data.idVerification,
        },
      });

      // 2. Create/Update recruiter public profile
      await prisma.recruiterProfile.upsert({
        where: { userId },
        update: {
          companyName: data.companyName,
          designation: data.designation,
          publicBio: data.publicBio,
        },
        create: {
          userId,
          companyName: data.companyName,
          designation: data.designation,
          publicBio: data.publicBio,
        },
      });
    }

    return NextResponse.json({ message: "Onboarding complete" });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}
