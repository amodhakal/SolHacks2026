import { NextResponse } from "next/server";
import { translateToEnglish } from "@/lib/translateToEnglish";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sourceLanguage = (data.language as string) || "english";
    console.log("Processing intake form from:", sourceLanguage, data);

    const translatedData = await translateToEnglish(data, sourceLanguage);
    console.log("Converted into English:", translatedData);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process form" },
      { status: 500 },
    );
  }
}
