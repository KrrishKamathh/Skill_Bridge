import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const students = await prisma.user.findMany({
      where: { 
        role: "STUDENT",
        studentProfile: { isNot: null }
      },
      include: {
        studentProfile: {
          include: {
            projects: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching talent pool" }, { status: 500 });
  }
}
