// app/api/auth/verify-reset-otp/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/verify-reset-otp
 * Verify the OTP code for password reset (without actually resetting password)
 * This is just the verification step - password reset happens in a separate route
 */
export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json({
        message: "Email and OTP are required"
      }, {
        status: 400
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        message: "User not found"
      }, {
        status: 404
      });
    }

    // Check if OTP matches
    if (user.verificationToken !== otp) {
      return NextResponse.json({
        message: "Invalid OTP code. Please check and try again."
      }, {
        status: 400
      });
    }

    // Check if OTP has expired
    if (new Date() > new Date(user.tokenExpiry)) {
      return NextResponse.json({
        message: "OTP has expired. Please request a new code."
      }, {
        status: 400
      });
    }

    console.log(`✅ Reset OTP verified for: ${email}`);

    return NextResponse.json({
      message: "OTP verified successfully. You can now set your new password.",
      verified: true
    });

  } catch (error) {
    console.error("Reset OTP verification error:", error);
    return NextResponse.json({
      message: "Failed to verify OTP",
      error: error.message
    }, {
      status: 500
    });
  }
}