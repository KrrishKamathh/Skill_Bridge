import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status, rejectionFeedback, skillGaps, suggestedCourses } = await req.json();

    const data: any = { status };
    
    if (status === "REJECTED") {
      data.rejectionFeedback = rejectionFeedback;
      data.skillGaps = skillGaps;
      data.suggestedCourses = suggestedCourses;
      // Default re-apply date: 30 days from now
      data.reapplyDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const application = await prisma.application.update({
      where: { id },
      data
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ message: "Error updating status" }, { status: 500 });
  }
}
