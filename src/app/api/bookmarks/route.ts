import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all bookmarks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            recruiterProfile: {
              select: { companyName: true, designation: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching bookmarks" }, { status: 500 });
  }
}

// POST: Add a bookmark
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { jobId } = await req.json();

    const bookmark = await prisma.bookmark.create({
      data: { userId, jobId }
    });

    return NextResponse.json(bookmark);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ message: "Already bookmarked" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error creating bookmark" }, { status: 500 });
  }
}

// DELETE: Remove a bookmark by jobId (sent in body)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { jobId } = await req.json();

    await prisma.bookmark.delete({
      where: { userId_jobId: { userId, jobId } }
    });

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    return NextResponse.json({ message: "Error removing bookmark" }, { status: 500 });
  }
}
