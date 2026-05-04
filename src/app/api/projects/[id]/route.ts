import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15+, params is a promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // We MUST await the params

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Direct delete for better stability on portable drives
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Project deleted" });
  } catch (error: any) {
    console.error("Delete Project Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
