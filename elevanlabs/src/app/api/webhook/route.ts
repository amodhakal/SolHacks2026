import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { info } = body;

    console.log("\n========================================");
    console.log("APPOINTMENT BOOKED - STORE_APPOINTMENT TOOL");
    console.log("========================================");
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
