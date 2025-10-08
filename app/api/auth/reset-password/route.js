// app/api/auth/reset-password/route.js
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/reset-password
 * Reset password using OTP
 * Reuses verification token system
 */
export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    // Validate input
    if (!email || !otp || !newPassword) {
      return NextResponse.json({
        message: "Email, OTP, and new password are required"
      }, {
        status: 400
      });
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json({
        message: "Password must be at least 8 characters"
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
        message: "Invalid reset code"
      }, {
        status: 400
      });
    }

    // Check if OTP matches
    if (user.verificationToken !== otp) {
      return NextResponse.json({
        message: "Invalid reset code. Please check and try again."
      }, {
        status: 400
      });
    }

    // Check if OTP has expired
    if (new Date() > new Date(user.tokenExpiry)) {
      return NextResponse.json({
        message: "Reset code has expired. Please request a new one."
      }, {
        status: 400
      });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { email },
      data: {
        hashedPassword,
        verificationToken: null,
        tokenExpiry: null,
      }
    });

    console.log(`✅ Password reset successfully for: ${email}`);

    return NextResponse.json({
      message: "Password reset successfully! You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({
      message: "Failed to reset password",
      error: error.message
    }, {
      status: 500
    });
  }
}