import { NextResponse } from "next/server";
import { sendVerificationCode, verifyCode } from "@/utils/twilio";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Check if Twilio credentials are set
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.VERIFY_SERVICE_SID
    ) {
      return NextResponse.json(
        {
          error:
            "Twilio configuration is missing. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    const { phoneNumber, code } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // If code is provided, verify it
    if (code) {
      try {
        const isVerified = await verifyCode(phoneNumber, code);
        if (isVerified) {
          const cookieStore = await cookies();
          cookieStore.set("phone_verified", "true", {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
        }
        return NextResponse.json({
          success: isVerified,
          message: isVerified
            ? "Phone number verified successfully!"
            : "Invalid verification code",
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || "Failed to verify code" },
          { status: 400 }
        );
      }
    }

    // Otherwise, send verification code
    try {
      const status = await sendVerificationCode(phoneNumber);
      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${phoneNumber}`,
        status,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to send verification code" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process verification request" },
      { status: 500 }
    );
  }
}
