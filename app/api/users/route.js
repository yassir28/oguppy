import prisma from "@/lib/prisma";
import { hash } from "bcrypt";          //for hashing passwords
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

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

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        verificationToken: otp,
        tokenExpiry: otpExpiry,
        role: role || "USER", // Use provided role or default to USER
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name);
    if (!emailResult.success) {
      // If email fails, still return success but notify
      console.error("Failed to send OTP email:", emailResult.error);
    }
    console.log("New user registered (pending verification):", newUser.email);
    
    // Return success response
    // Don't send back the password hash for security
    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      message: "Registration successful! Please check your email for the verification code.",
      requiresVerification: true,
      role: newUser.role,
    });

//    return NextResponse.json(newUser); ????
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}




/**
 * GET - Fetch all users
 * Protected: Only ADMIN can view all users
 */
export async function GET(request) {
  // Check if user is ADMIN
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  try {
    // Fetch all users except passwords
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    return NextResponse.json({ 
      error: error.message,
      message: "Failed to fetch users" 
    }, { 
      status: 500 
    });
  }
}
