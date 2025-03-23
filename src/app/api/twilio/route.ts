//src/app/api/twilio/route.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Let's assume you have an array of known valid phone numbers:
const validPhones = [
  "+16195362504" 
  // etc. or query from your DB...
];

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

function normalizeUSNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  // As a fallback, just prepend +
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const { toPhoneNumber, message } = await request.json();

    // 1. Validate input
    if (!toPhoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: "Missing 'toPhoneNumber' or 'message'." },
        { status: 400 }
      );
    }

    // 2. Normalize to E.164 (+1...) for US numbers
    const normalized = normalizeUSNumber(toPhoneNumber);

    // 3. Check against your "database"
    //    If phone is not in validPhones, return an error
    if (!validPhones.includes(normalized)) {
      return NextResponse.json(
        {
          success: false,
          error: `Phone number ${normalized} not found in database.`,
        },
        { status: 404 }
      );
    }

    // 4. Attempt to send SMS via Twilio
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: normalized,
    });

    // 5. Return success if Twilio didn't throw
    return NextResponse.json({
      success: true,
      info: `Message sent to ${normalized}`,
      sid: response.sid,
      // You can also include the Twilio 'status'
      status: response.status, 
      // Twilio returns other fields like 'errorCode', 'errorMessage' if something went wrong internally
    });
  } catch (error: any) {
    // 6. Catch Twilio or other errors
    console.error("Twilio send error:", error); // Logs server-side
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send SMS." },
      { status: 500 }
    );
  }
}
