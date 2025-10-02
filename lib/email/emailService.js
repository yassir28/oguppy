// lib/email/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP code
 * @returns {string} - 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry time (10 minutes from now)
 * @returns {Date} - Expiry timestamp
 */
export function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

/**
 * Send OTP verification email to user
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} userName - User's name
 */
export async function sendOTPEmail(email, otp, userName = 'User') {
  try {
    const data = await resend.emails.send({
      from: 'Inventory System <onboarding@resend.dev>', // Change to your domain
      to: email,
      subject: 'Verify Your Email Address - OTP Code',
      html: getOTPEmailTemplate(otp, userName),
    });

    console.log('✅ OTP email sent successfully:', email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 */
export async function sendWelcomeEmail(email, userName) {
  try {
    const data = await resend.emails.send({
      from: 'Inventory System <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Inventory System! 🎉',
      html: getWelcomeEmailTemplate(userName),
    });

    console.log('✅ Welcome email sent successfully:', email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Beautiful OTP email template
 */
function getOTPEmailTemplate(otp, userName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📦 Inventory System</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Hello ${userName}! 👋</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Thank you for registering with Inventory System. To complete your registration, please verify your email address using the code below:
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                      <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <h1 style="color: #667eea; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                      ⏰ This code will expire in <strong>10 minutes</strong>.<br>
                      🔒 For security reasons, please do not share this code with anyone.
                    </p>
                    
                    <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © 2025 Inventory System. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Welcome email template
 */
function getWelcomeEmailTemplate(userName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎉 Welcome!</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #333333; margin: 0 0 20px 0;">Welcome to Inventory System, ${userName}!</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                      Your account has been successfully verified. You can now log in and start managing your inventory.
                    </p>
                    <div style="margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Login Now
                      </a>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © 2025 Inventory System. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}