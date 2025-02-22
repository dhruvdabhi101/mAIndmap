import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

type SignupRequestBody = {
  email: string;
  password: string;
  role?: string;
  name?: string;
};

export async function POST(request: Request) {
  try {
    const body: SignupRequestBody = await request.json();
    const { email, password, role, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists", success: false },
        { status: 400 }
      );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        username: email?.split("@")[0],
        name: name || "Albert",
        password: hashedPassword,
        role: (role || "user") as any,
      },
    });

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "10d" } // Token expires in 10 days
    );

    return NextResponse.json(
      {
        message: "sugnup successful",
        success: true,
        data: { token: token, user: user },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
