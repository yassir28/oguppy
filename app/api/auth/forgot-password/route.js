// app/api/auth/forgot-password/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateOTP, getOTPExpiry, sendPasswordResetEmail } from "@/lib/email/emailService";

/**
 * POST /api/auth/forgot-password
 * Send OTP for password reset
 * Reuses the verification token system
 */
export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({
        message: "Email is required"
      }, {
        status: 400
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Security: Don't reveal if email exists or not
    // Always return success to prevent email enumeration attacks
    if (!user) {
      // Return success even if user doesn't exist
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset code."
      });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update user with password reset token
    // Reusing verificationToken and tokenExpiry fields
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: otp,
        tokenExpiry: otpExpiry,
      }
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, otp, user.name || 'User');

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
    }

    console.log(`✅ Password reset OTP sent to: ${email}`);

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset code."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({
      message: "Failed to process request",
      error: error.message
    }, {
      status: 500
    });
  }
}