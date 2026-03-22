import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Email, password, and role are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() as any, // Cast to any to bypass temporary Prisma type desync in IDE
        // Create the empty profile immediately based on role
        ...(role.toUpperCase() === "STUDENT" ? {
          studentProfile: {
            create: {}
          }
        } : {
          recruiterProfile: {
            create: {}
          }
        })
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email } }, 
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Something went wrong", details: String(error), stack: error?.stack }, { status: 500 });
  }
}
