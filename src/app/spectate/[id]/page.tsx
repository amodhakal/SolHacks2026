"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const AGENT_A_ID = "agent_4101kmtj9kvzeq7b2chwarrvhq0g";
const AGENT_B_ID = "agent_8901kmv2rdjpedx8pe0xh4mv605c";

interface TranscriptMessage {
  id: number;
  role: "patient" | "receptionist";
  text: string;
  timestamp: Date;
}

interface PatientInfo {
  email: string;
  dob: string;
  insurance: string;
  phone: string;
  appointmentDateTime: string;
  language: string;
  firstName: string;
  lastName: string;
  medical_department: string;
  additionalInfo: string;
}

export default function SpectatePage({
  searchParams,
}: {
  searchParams: Promise<{ patientInfo?: string }>;
}) {
  const [patientInfo, setPatientInfo] = useState<string>("");
  const [patientInfoObj, setPatientInfoObj] = useState<PatientInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [patientSpeaking, setPatientSpeaking] = useState(false);
  const [receptionistSpeaking, setReceptionistSpeaking] = useState(false);
  const [currentPatientText, setCurrentPatientText] = useState("");
  const [currentReceptionistText, setCurrentReceptionistText] = useState("");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const wsARef = useRef<WebSocket | null>(null);
  const wsBRef = useRef<WebSocket | null>(null);
  const transcriptIdRef = useRef(0);
  const waitingForBResponseRef = useRef(false);
  const waitingForAResponseRef = useRef(false);

  useEffect(() => {
    searchParams.then((p) => {
      console.log("Raw patientInfo query param:", p.patientInfo);
      if (p.patientInfo) {
        const decoded = decodeURIComponent(p.patientInfo);
        console.log("Decoded patientInfo:", decoded);
        setPatientInfo(decoded);
        try {
          const parsed = JSON.parse(decoded);
          console.log("Parsed patientInfoObj:", parsed);
          setPatientInfoObj(parsed);
          setMounted(true);
        } catch (e) {
          console.error("Failed to parse patient info:", e);
          setMounted(true);
        }
      } else {
        setError("Missing patient info");
        setMounted(true);
      }
    });
  }, [searchParams]);

  const sendMessageToAgent = useCallback((message: string, agent: "A" | "B") => {
    const ws = agent === "A" ? wsARef.current : wsBRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "user_message",
          text: message,
        })
      );
    }
  }, []);

  const connectAgent = useCallback(
    (agentId: string, agent: "A" | "B"): Promise<WebSocket> => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(
          `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`
        );

        ws.onopen = () => {
          console.log(`Connected to Agent ${agent}`);
          const initData: Record<string, unknown> = {
            type: "conversation_initiation_client_data",
          };
          
          if (agent === "A" && patientInfoObj) {
            initData.dynamic_variables = {
              patient_info: JSON.stringify(patientInfoObj),
            };
            console.log("Sending dynamic variables to agent A:", initData.dynamic_variables);
          }
          
          ws.send(JSON.stringify(initData));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "conversation_initiation_metadata":
              console.log(`Agent ${agent} metadata:`, data.conversation_initiation_metadata_event);
              break;

            case "conversation_initiation_client_data":
              console.log(`Agent ${agent} ready`);
              if (agent === "A" && patientInfoObj) {
                const p = patientInfoObj;
                const spectateText = `You are ${p.firstName} ${p.lastName}, a patient calling a hospital. Your details: email: ${p.email}, phone: ${p.phone}, DOB: ${p.dob}, insurance: ${p.insurance}, department: ${p.medical_department}, preferred language: ${p.language}. Additional info: ${p.additionalInfo}. Start the conversation by greeting and explaining why you're calling.`;
                console.log("Patient info being sent to agent:", spectateText);
                setTimeout(() => {
                  ws.send(
                    JSON.stringify({
                      type: "contextual_update",
                      text: spectateText,
                    })
                  );
                }, 500);
              } else if (agent === "B") {
                setTimeout(() => {
                  ws.send(
                    JSON.stringify({
                      type: "contextual_update",
                      text: `You are a hospital receptionist answering calls. Help patients book appointments. When they provide their email and preferred language, call the book_appointment tool. Be professional and helpful.`,
                    })
                  );
                }, 500);
              }
              break;

            case "agent_response":
              const response = data.agent_response_event?.agent_response;
              if (response) {
                console.log(`Agent ${agent} response:`, response);
                
                if (agent === "A") {
                  setCurrentPatientText(response);
                  setPatientSpeaking(true);
                  waitingForAResponseRef.current = false;
                  
                  setTimeout(() => {
                    setCurrentPatientText("");
                    setPatientSpeaking(false);
                    
                    if (!waitingForBResponseRef.current) {
                      waitingForBResponseRef.current = true;
                      sendMessageToAgent(response, "B");
                    }
                  }, 2000);
                } else {
                  setCurrentReceptionistText(response);
                  setReceptionistSpeaking(true);
                  waitingForBResponseRef.current = false;
                  
                  setTimeout(() => {
                    setCurrentReceptionistText("");
                    setReceptionistSpeaking(false);
                    
                    if (!waitingForAResponseRef.current) {
                      waitingForAResponseRef.current = true;
                      sendMessageToAgent(response, "A");
                    }
                  }, 2000);
                }
              }
              break;

            case "user_transcript":
              console.log(`Agent ${agent} heard:`, data.user_transcription_event?.user_transcript);
              break;

            case "ping":
              setTimeout(() => {
                ws.send(
                  JSON.stringify({
                    type: "pong",
                    event_id: data.ping_event.event_id,
                  })
                );
              }, data.ping_event.ping_ms);
              break;

            case "client_tool_call":
              console.log(`Agent ${agent} tool call:`, data.client_tool_call);
              break;

            default:
              break;
          }
        };

        ws.onerror = (err) => {
          console.error(`WebSocket error for Agent ${agent}:`, err);
          reject(err);
        };

        ws.onclose = () => {
          console.log(`Disconnected from Agent ${agent}`);
          if (agent === "A") {
            setPatientSpeaking(false);
          } else {
            setReceptionistSpeaking(false);
          }
        };

        resolve(ws);
      });
    },
    [patientInfoObj, sendMessageToAgent]
  );

  const startConversation = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      const wsA = await connectAgent(AGENT_A_ID, "A");
      wsARef.current = wsA;
      
      const wsB = await connectAgent(AGENT_B_ID, "B");
      wsBRef.current = wsB;

      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError("Failed to connect to agents. Check console for details.");
      setIsConnecting(false);
    }
  }, [connectAgent]);

  const stopConversation = useCallback(() => {
    if (wsARef.current) {
      wsARef.current.close();
      wsARef.current = null;
    }
    if (wsBRef.current) {
      wsBRef.current.close();
      wsBRef.current = null;
    }
    setIsConnected(false);
    setIsEnded(true);
    setPatientSpeaking(false);
    setReceptionistSpeaking(false);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Agent-to-Agent Voice Conversation
          </h1>
          <p className="text-zinc-400">
            Patient Caller Agent calls Hospital Receptionist to book an appointment
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-zinc-200">
            Patient Information
          </h2>
          <pre className="bg-zinc-700 p-4 rounded-md overflow-auto text-sm text-zinc-300">
            {patientInfo || "Loading..."}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div
            className={`rounded-lg p-6 transition-all ${
              patientSpeaking
                ? "bg-blue-900/40 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🤖</span>
              <h3 className="text-xl font-semibold">Patient Caller Agent</h3>
              {patientSpeaking && (
                <span className="ml-auto flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-blue-400">Speaking</span>
                </span>
              )}
            </div>
            <div className="min-h-[80px] bg-zinc-700/50 rounded-lg p-4">
              {currentPatientText ? (
                <p className="text-blue-200 text-lg">{currentPatientText}</p>
              ) : (
                <p className="text-zinc-500 italic">
                  {isConnected ? "Waiting to speak..." : "Not yet connected"}
                </p>
              )}
            </div>
            {patientSpeaking && (
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-blue-500 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            className={`rounded-lg p-6 transition-all ${
              receptionistSpeaking
                ? "bg-green-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20"
                : "bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏥</span>
              <h3 className="text-xl font-semibold">Hospital Receptionist</h3>
              {receptionistSpeaking && (
                <span className="ml-auto flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-400">Speaking</span>
                </span>
              )}
            </div>
            <div className="min-h-[80px] bg-zinc-700/50 rounded-lg p-4">
              {currentReceptionistText ? (
                <p className="text-green-200 text-lg">
                  {currentReceptionistText}
                </p>
              ) : (
                <p className="text-zinc-500 italic">
                  {isConnected ? "Waiting to speak..." : "Not yet connected"}
                </p>
              )}
            </div>
            {receptionistSpeaking && (
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-200">Transcript</h2>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                isConnected
                  ? "bg-green-900/50 text-green-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {isConnected ? "Connected" : isEnded ? "Ended" : "Disconnected"}
            </span>
          </div>
          <div
            className="space-y-3 max-h-64 overflow-y-auto"
            id="transcript-container"
          >
            {transcript.length === 0 ? (
              <p className="text-zinc-500 italic">
                Transcript will appear here...
              </p>
            ) : (
              transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.role === "receptionist"
                      ? "bg-green-900/30 text-green-200 border-l-4 border-green-500"
                      : "bg-blue-900/30 text-blue-200 border-l-4 border-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {msg.role === "receptionist"
                        ? "🏥 Receptionist"
                        : "🤖 Patient Caller"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {!isConnected && !isEnded ? (
            <button
              onClick={startConversation}
              disabled={!mounted || isConnecting || !patientInfoObj}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {!mounted || !patientInfoObj ? (
                "Loading..."
              ) : isConnecting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                "🎙️ Start Conversation"
              )}
            </button>
          ) : isConnected ? (
            <button
              onClick={stopConversation}
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors"
            >
              Stop Conversation
            </button>
          ) : null}
        </div>

        {isEnded && (
          <div className="mt-8 bg-zinc-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-medium mb-2 text-zinc-200">
              Conversation Ended
            </h3>
            <p className="text-zinc-400">
              Check the console or webhook logs for the final appointment
              details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
