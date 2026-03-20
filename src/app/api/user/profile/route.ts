import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure the user calling this API is securely authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    // Update the precise user record in the SQLite database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
