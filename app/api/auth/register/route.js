// app/api/user/route.js
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { generateOTP, getOTPExpiry, sendOTPEmail } from "@/lib/email/emailService";

export async function POST(request) {
  try {
    // Extract user data from request body
    const { name, email, password, role } = await request.json();

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // ============================================
    // BIG TECH APPROACH: Handle unverified users
    // ============================================
    if (existingUser) {
      // Case 1: Email exists AND is verified
      if (existingUser.emailVerified) {
        return NextResponse.json(
          {
            message: "User with this email already exists",
            user: null,
          },
          { status: 409 }
        );
      }
      
      // Case 2: Email exists BUT not verified yet
      // Instead of blocking, resend verification email
      console.log(`Resending verification for unverified user: ${email}`);
      
      // Generate new OTP
      const newOTP = generateOTP();
      const newExpiry = getOTPExpiry();
      
      // Update existing user with new OTP (and optionally update password/name)
      const hashedPassword = await hash(password, 10);
      
      await prisma.user.update({
        where: { email },
        data: {
          name: name || existingUser.name, // Update name if provided
          hashedPassword, // Update password with new one
          verificationToken: newOTP,
          tokenExpiry: newExpiry,
        },
      });
      
      // Send new OTP email
      await sendOTPEmail(email, newOTP, name || existingUser.name);
      
      return NextResponse.json({
        message: "Verification email resent! Please check your inbox.",
        requiresVerification: true,
        isResend: true, // Flag to indicate this was a resend
      });
    }

    // ============================================
    // New user registration
    // ============================================
    
    // Hash the password before storing
    const hashedPassword = await hash(password, 10);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create new user with OTP (email not verified yet)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: role || "USER",
        verificationToken: otp,
        tokenExpiry: otpExpiry,
        emailVerified: null, // Not verified yet
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name);

    if (!emailResult.success) {
      // If email fails, still return success but notify
      console.error("Failed to send OTP email:", emailResult.error);
    }

    console.log("New user registered (pending verification):", newUser.email);
    
    // Return success response with email info
    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      message: "Registration successful! Please check your email for the verification code.",
      requiresVerification: true,
    });
  } catch (error) {
    console.log("User creation error:", error);
    return NextResponse.json({ 
      error: error.message,
      message: "Failed to create user" 
    }, { 
      status: 500 
    });
  }
}

// Optional: API endpoint to get all users (admin only)
export async function GET(request) {
  try {
    // In a real application, you'd check if the requester is an admin
    // For now, this returns all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Don't select hashedPassword for security
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