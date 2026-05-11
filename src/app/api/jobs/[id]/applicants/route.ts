import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const jobId = params.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          include: {
            user: {
              include: {
                studentProfile: {
                  include: {
                    projects: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });

    return NextResponse.json(job.applications);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching applicants" }, { status: 500 });
  }
}
