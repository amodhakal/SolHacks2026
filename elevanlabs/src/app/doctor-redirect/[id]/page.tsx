import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const AGENT_ID = "agent_4101kmtj9kvzeq7b2chwarrvhq0g";
const BRANCH_ID = "agtbrch_9801kmtj9nrxef88z93mdkzfmfgy";

export default async function DoctorRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ patientInfo?: string }>;
}) {
  const { id } = await params;
  const { patientInfo } = await searchParams;

  if (!patientInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Missing patient info</p>
      </div>
    );
  }

  const url = `https://elevenlabs.io/app/talk-to?agent_id=${AGENT_ID}&branch_id=${BRANCH_ID}&var_patient_info=${encodeURIComponent(patientInfo)}`;

  redirect(url);
}
