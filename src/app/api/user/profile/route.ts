import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure the user calling this API is securely authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { 
      name, bio, company, skills, resumeUrl, certificates,
      projects, education, experience, achievements, preferences, socials 
    } = await req.json();
    
    const userRole = (session.user as any)?.role;

    // Update the main User record with social links
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        name,
        githubUrl: socials?.github,
        linkedinUrl: socials?.linkedin,
        twitterUrl: socials?.twitter
      },
    });

    if (userRole === "STUDENT") {
      // Handle skills: upsert each skill and connect to profile
      const skillConnections = skills ? await Promise.all(
        skills.map(async (skillName: string) => {
          const skill = await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName },
          });
          return { id: skill.id };
        })
      ) : [];

      const studentProfile = await prisma.studentProfile.upsert({
        where: { userId: updatedUser.id },
        update: { 
          bio,
          resumeUrl,
          achievements: achievements || [],
          preferences: preferences || {},
          skills: {
            set: skillConnections
          }
        },
        create: { 
          userId: updatedUser.id, 
          bio,
          resumeUrl,
          achievements: achievements || [],
          preferences: preferences || {},
          skills: {
            connect: skillConnections
          }
        },
      });

      // Sync complex relations: delete old and create new for simplicity in this profile edit flow
      const studentId = studentProfile.id;

      // 1. Certificates
      if (certificates) {
        await prisma.certificate.deleteMany({ where: { studentId } });
        if (certificates.length > 0) {
          await prisma.certificate.createMany({
            data: certificates.map((cert: any) => ({
              studentId,
              title: cert.title,
              issuer: cert.issuer,
              year: cert.year,
              proofUrl: cert.proofUrl
            }))
          });
        }
      }

      // 2. Projects (Portfolio)
      if (projects) {
        await prisma.project.deleteMany({ where: { studentProfileId: studentId } });
        if (projects.length > 0) {
          await prisma.project.createMany({
            data: projects.map((p: any) => ({
              studentProfileId: studentId,
              title: p.title,
              description: p.description,
              url: p.url,
              techStack: p.techStack
            }))
          });
        }
      }

      // 3. Education
      if (education) {
        await prisma.education.deleteMany({ where: { studentId } });
        if (education.length > 0) {
          await prisma.education.createMany({
            data: education.map((e: any) => ({
              studentId,
              school: e.school,
              degree: e.degree,
              year: e.year,
              gpa: e.gpa
            }))
          });
        }
      }

      // 4. Experience
      if (experience) {
        await prisma.experience.deleteMany({ where: { studentId } });
        if (experience.length > 0) {
          await prisma.experience.createMany({
            data: experience.map((exp: any) => ({
              studentId,
              company: exp.company,
              position: exp.position,
              duration: exp.duration,
              description: exp.description
            }))
          });
        }
      }
    } else if (userRole === "RECRUITER") {
      await prisma.recruiterProfile.upsert({
        where: { userId: updatedUser.id },
        update: { company },
        create: { userId: updatedUser.id, company },
      });
    }

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Something went wrong", details: error.message }, { status: 500 });
  }
}
