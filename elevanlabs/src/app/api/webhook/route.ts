import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language, info } = body;

    if (!email || !language || !info) {
      return NextResponse.json(
        { error: "Missing required fields: email, language, and info are required" },
        { status: 401 }
      );
    }

    console.log("\n========================================");
    console.log("APPOINTMENT BOOKED - STORE_APPOINTMENT TOOL");
    console.log("========================================");
    console.log("Email:", email);
    console.log("Language:", language);
    console.log("Appointment Info:");
    console.log(info);
    console.log("========================================\n");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Webhook endpoint working" });
}
