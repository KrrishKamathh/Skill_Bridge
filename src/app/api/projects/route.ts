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

    const { title, description, evidenceLink } = await req.json();
    const userId = (session.user as any).id;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile) {
      return NextResponse.json({ message: "Student profile not found" }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        studentProfileId: studentProfile.id,
        title,
        description,
        evidenceLink
      }
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
