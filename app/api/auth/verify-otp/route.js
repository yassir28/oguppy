// app/api/auth/verify-otp/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/emailService";

/**
 * POST /api/auth/verify-otp
 * Verify the OTP code sent to user's email
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

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can login now."
      }, {
        status: 200
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

    // Mark email as verified and clear OTP
    const verifiedUser = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        tokenExpiry: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    // Send welcome email
    await sendWelcomeEmail(email, user.name || 'User');

    console.log(`✅ Email verified successfully: ${email}`);

    return NextResponse.json({
      message: "Email verified successfully! You can now login.",
      user: verifiedUser
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({
      message: "Failed to verify OTP",
      error: error.message
    }, {
      status: 500
    });
  }
}