Plan:
1. POST /api/appointments - receives patientInfo body, generates unique appointmentId, returns URL /doctor/[appointmentId], console.logs the URL
2. /doctor/[appointmentId] page - real-time voice conversation using @elevenlabs/react with WebRTC, receives patientInfo as dynamic variables
3. On conversation end, console.log the scheduling info (appointment details)
This is a simpler implementation than the full PRD - no database, no email, just the core flow.
Here's the plan:
---
Simplified Appointment Booking System
API Route: POST /api/appointments
- Accepts any JSON body (patientInfo)
- Generates unique appointmentId
- Returns: { url: "/doctor/[appointmentId]" }
- Console.logs: The doctor URL for the user to open
Page: /doctor/[appointmentId]
- Connects to ElevenLabs agent via WebRTC (@elevenlabs/react)
- Passes patientInfo as dynamic variables to agent
- Real-time voice conversation:
  - TTS audio plays as agent speaks
  - Doctor speaks into microphone → sent to agent
- Uses onConversationEnd callback to capture when call finishes
Flow
1. POST /api/appointments { patientInfo }
   → console.log("Doctor URL: http://localhost:3000/doctor/abc123")
2. User opens URL, clicks "Join Call"
   → ElevenLabs agent calls with patient details
   → "Hello, I need to schedule an appointment for [patient name]..."
3. Doctor speaks response via microphone
4. When call ends → console.log(appointment scheduling info)
Files to Create
/app
  /api/appointments/route.ts   - Create appointment, return URL
  /doctor/[id]/page.tsx        - Voice conversation page
  /page.tsx                    - Simple form to test API
/lib
  elevenlabs.ts                - Agent config
---
