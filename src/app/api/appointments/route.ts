import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAppointment } from "@/lib/appointments";

export async function POST(request: NextRequest) {
  const patientInfo = await request.json();

  if (!patientInfo || Object.keys(patientInfo).length === 0) {
    return NextResponse.json(
      { error: "Patient information is required" },
      { status: 400 }
    );
  }

  const appointment = createAppointment(patientInfo);

  const { email, language, ...doctorInfo } = patientInfo;

  const baseUrl = request.nextUrl.origin;
  const encodedPatientInfo = encodeURIComponent(JSON.stringify(patientInfo));
  const spectateUrl = `${baseUrl}/spectate/${appointment.id}?patientInfo=${encodedPatientInfo}`;

  console.log("\n========================================");
  console.log("NEW APPOINTMENT REQUEST");
  console.log("========================================");
  console.log("Patient Info (for doctor):", JSON.stringify(doctorInfo, null, 2));
  console.log("Email:", email || "Not provided");
  console.log("Language:", language || "Not provided");
  console.log("\nSpectate URL:", spectateUrl);
  console.log("========================================\n");

  return NextResponse.json({
    id: appointment.id,
    url: spectateUrl,
    patientInfo: patientInfo,
    email: email,
    language: language,
    message: "Appointment created. Check console for spectate URL.",
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id is required" },
      { status: 400 }
    );
  }

  const appointment = getAppointment(id);

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}
