# Medilin

**Live Demo:** https://sol-hacks2026.vercel.app

## Project Description

Medilin is a multilingual healthcare appointment booking platform that uses AI voice agents to streamline the process of scheduling medical appointments. Patients can fill out intake forms in their native language, and AI agents powered by ElevenLabs voice technology communicate with each other to find and confirm an available appointment time.

### How It Works

1. **Patient Intake**: Users fill out a healthcare intake form in their preferred language
2. **AI Negotiation**: Two AI agents (patient representative and clinic scheduler) converse in real-time to find a suitable appointment time
3. **Confirmation**: Once an agreement is reached, the patient receives a confirmation email with the appointment details in their chosen language

### Future Plans

In the future, Medilin will automatically call the health clinic or hospital to confirm the appointment, eliminating the need for manual intervention. Users will only need to fill out the form and receive an automatic email confirmation once everything is processed.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **AI Voice:** ElevenLabs
- **AI Language Model:** Google Gemini
- **Email:** Resend
- **Deployment:** Vercel

## Code Repository

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

1. Fill out and submit the intake form in your preferred language
2. Open the browser console (F12 or right-click → Inspect → Console)
3. Copy the spectate URL shown in the console
4. Navigate to the spectate URL
5. Click "Start Conversation" to begin the AI agent call
6. Click "Stop" once the agents have negotiated an appointment time
7. Check your email for the confirmation message in the language you used to fill out the form

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
