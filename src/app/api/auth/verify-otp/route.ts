// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";
import { findUserByPhone, User } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();
    const storedCode = otpStore[phoneNumber];
    if (!storedCode || code !== storedCode) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code." },
        { status: 401 }
      );
    }

    // OTP is valid => find the user
    const user: User | undefined = findUserByPhone(phoneNumber);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 401 }
      );
    }

    // Clear the code from store
    delete otpStore[phoneNumber];

    // Create a session cookie with the user's phoneNumber
    // A real app would use JWT or next-auth for security
    const response = NextResponse.json({ success: true, message: "Logged in" });
    response.cookies.set({
      name: "phoneNumber",
      value: phoneNumber,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour for example
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error verifying OTP" },
      { status: 500 }
    );
  }
}
