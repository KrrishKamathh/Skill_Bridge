import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching marketplace" }, { status: 500 });
  }
}
