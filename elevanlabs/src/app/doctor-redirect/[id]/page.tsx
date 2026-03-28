import { redirect } from "next/navigation";

const AGENT_ID = "agent_4101kmtj9kvzeq7b2chwarrvhq0g";
const BRANCH_ID = "agtbrch_9801kmtj9nrxef88z93mdkzfmfgy";

export default async function DoctorRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/appointments?id=${id}`
  );
  const appointment = await res.json();

  if (!appointment || appointment.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Appointment not found</p>
      </div>
    );
  }

  const patientInfo = JSON.stringify(appointment.patientInfo);
  const url = `https://elevenlabs.io/app/talk-to?agent_id=${AGENT_ID}&branch_id=${BRANCH_ID}&var_patient_info=${encodeURIComponent(patientInfo)}`;

  redirect(url);
}
