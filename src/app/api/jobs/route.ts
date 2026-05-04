import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, jobType, location, description } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { recruiterProfile: true }
    });

    if (!user || !user.recruiterProfile) {
      return NextResponse.json({ message: "Recruiter profile not found" }, { status: 404 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        jobType,
        location,
        description,
        recruiterProfileId: user.recruiterProfile.id
      }
    });

    return NextResponse.json(job);
  } catch (error: any) {
    console.error("Post Job Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { recruiterProfile: { include: { jobs: true } } }
    });

    return NextResponse.json(user?.recruiterProfile?.jobs || []);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
