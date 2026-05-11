import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            recruiterProfile: {
              select: { companyName: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching applications" }, { status: 500 });
  }
}
