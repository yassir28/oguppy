import prisma from "@/lib/prisma";
import { hash } from "bcrypt";          //for hashing passwords
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Check if user email already Exists
    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (userExist) {
      return NextResponse.json(
        {
          message: "User Already exists",
          user: null,
        },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    console.log(User);
    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}