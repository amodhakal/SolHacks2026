# Medilin

**Live Demo:** https://sol-hacks2026.vercel.app

## Project Description

Medilin is a proof-of-concept multilingual healthcare appointment booking platform designed to help patients who face language barriers or time constraints when scheduling medical appointments. 

The vision is simple: patients fill out an intake form in their native language, and an AI agent automatically calls the clinic to book an appointment on their behalf. The patient receives a confirmation email—no phone calls, no language barriers, no hassle.

**Current Demo Status:** This hackathon prototype demonstrates the core AI voice negotiation technology. Instead of calling real clinics, two AI agents simulate the conversation (patient representative and clinic scheduler) to show how the automated booking would work.

### How It Works

1. **Patient Intake**: Users fill out a healthcare intake form in their preferred language
2. **AI Voice Demo**: Two AI agents (powered by ElevenLabs) simulate a real-time conversation to negotiate an appointment time, demonstrating the technology that would be used when calling actual clinics
3. **Confirmation**: Once the agents reach an agreement, the patient receives a confirmation email with appointment details in their chosen language

### Production Vision

In a production deployment, the AI agent would:
- Actually call the healthcare provider's scheduling line
- Handle real availability checks and calendar integration
- Manage conflicts and rescheduling
- Integrate with clinic EMR/scheduling systems
- Handle HIPAA compliance requirements

**What This Demo Proves:** The multilingual voice AI technology works and can conduct natural appointment booking conversations. The simulated two-agent conversation showcases the interaction that would happen between our AI and a real clinic scheduler.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **AI Voice:** ElevenLabs
- **AI Language Model:** Google Gemini
- **Email:** Resend
- **Deployment:** Vercel

## Setup Instructions

1. **Clone the repository**
```bash
   git clone https://github.com/amodhakal/SolHacks2026.git
   cd SolHacks2026
```

2. **Install dependencies**
```bash
   npm install
   # or
   bun install
```

3. **Configure environment variables**
```bash
   cp .env.example .env
```
   
   Add the following keys to `.env`:
   - `ELEVENLABS_API_KEY` - Your ElevenLabs API key
   - `GOOGLE_GENERATIVE_AI_API_KEY` - Your Google Gemini API key
   - `RESEND_API_KEY` - Your Resend API key for sending emails

4. **Run the development server**
```bash
   npm run dev
```

5. **Open in browser**
   Visit http://localhost:3000

## How to Demo

**Note:** The demo flow is intentionally manual to showcase the AI negotiation process. In production, this would all happen automatically in the background.

1. Fill out and submit the intake form in your preferred language
2. Open the browser console (F12 or right-click → Inspect → Console)
3. Copy the spectate URL shown in the console
4. Navigate to the spectate URL to observe the AI agents
5. Click "Start Conversation" to begin the simulated appointment booking call
6. Listen as the two AI agents negotiate an appointment time
7. Click "Stop" once the agents have reached an agreement
8. Check your email for the confirmation message in the language you originally selected

## Project Structure
```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main intake form
│   │   ├── language/[slug]/      # Language-specific pages
│   │   ├── spectate/[id]/        # Spectator page for agent calls
│   │   ├── api/
│   │   │   ├── intake/           # Intake form submission
│   │   │   ├── appointments/     # Appointment booking
│   │   │   ├── webhook/          # ElevenLabs webhook handler
│   │   │   └── health/           # Health check endpoint
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── actions.ts
│   ├── components/
│   │   └── ElevenLabsProvider.tsx
│   └── lib/
│       ├── translateFromEnglish.ts
│       ├── translateToEnglish.ts
│       └── appointments.ts
├── public/
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## The Problem We're Solving

Millions of people struggle to book medical appointments due to:
- Language barriers in healthcare systems
- Time constraints (can't call during business hours)
- Phone anxiety or difficulty navigating automated systems
- Lack of internet access to online booking portals

Medilin removes these barriers by having AI handle the entire booking process on the patient's behalf.
