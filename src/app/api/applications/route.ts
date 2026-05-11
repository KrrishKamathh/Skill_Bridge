import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { jobId } = await req.json();

    const application = await prisma.application.create({
      data: {
        userId: (session.user as any).id,
        jobId: jobId
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ message: "Already applied or error" }, { status: 400 });
  }
}
