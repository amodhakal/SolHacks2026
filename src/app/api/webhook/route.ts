import { NextRequest, NextResponse } from "next/server";
import { translateFromEnglish } from "@/lib/translateFromEnglish";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language, info } = body;

    if (!email || !language || !info) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, language, and info are required",
        },
        { status: 401 },
      );
    }

    console.log(
      `Webhook original: `,
      JSON.stringify({ email, language, info }),
    );

    const translatedMessage = await translateFromEnglish(info, language);
    console.log(`Sending email to ${email}: ${translatedMessage}`);

    // TODO: Send an email

    return NextResponse.json({
      success: true,
      email,
      translatedMessage,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook endpoint working",
  });
}
