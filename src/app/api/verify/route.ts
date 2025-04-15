import { NextResponse } from "next/server";
import { sendVerificationCode, verifyCode } from "@/utils/twilio";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // If code is provided, verify it
    if (code) {
      const isVerified = await verifyCode(phoneNumber, code);
      if (isVerified) {
        const cookieStore = await cookies();
        cookieStore.set("phone_verified", "true", {
          path: "/",
          maxAge: 60, // 30 days
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
    }

    // Otherwise, send verification code
    const status = await sendVerificationCode(phoneNumber);
    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${phoneNumber}`,
      status,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to process verification request" },
      { status: 500 }
    );
  }
}
