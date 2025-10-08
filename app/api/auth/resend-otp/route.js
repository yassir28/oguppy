// app/api/auth/resend-otp/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateOTP, getOTPExpiry, sendOTPEmail } from "@/lib/email/emailService";

/**
 * POST /api/auth/resend-otp
 * Resend OTP code to user's email
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

    if (!user) {
      return NextResponse.json({
        message: "User not found"
      }, {
        status: 404
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can login now."
      }, {
        status: 200
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();
    const newExpiry = getOTPExpiry();

    // Update user with new OTP
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: newOTP,
        tokenExpiry: newExpiry,
      }
    });

    // Send new OTP email
    const emailResult = await sendOTPEmail(email, newOTP, user.name || 'User');

    if (!emailResult.success) {
      return NextResponse.json({
        message: "Failed to send email. Please try again."
      }, {
        status: 500
      });
    }

    console.log(`✅ OTP resent successfully: ${email}`);

    return NextResponse.json({
      message: "A new verification code has been sent to your email."
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({
      message: "Failed to resend OTP",
      error: error.message
    }, {
      status: 500
    });
  }
}