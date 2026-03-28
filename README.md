# MedLingo - Multilingual Doctor Appointment System

A multilingual healthcare appointment booking system that enables patients to book doctor appointments in their native language.

## How It Works

1. **Language Selection**: The UI prompts users to select their preferred language
2. **Localized Interface**: All form labels and UI elements are displayed in the user's selected language
3. **Native Input**: Users fill out the appointment form in their own language
4. **Translation**: Gemini API translates the user's input from their language to English
5. **Appointment Booking**: ElevenLabs API handles the doctor appointment scheduling

## Project Structure

```
SolHacks2026/
├── ui/            # Frontend application (language selection & form UI)
├── geminiapi/     # Translation service (Gemini API integration)
├── elevanlabs/    # Appointment booking service (ElevenLabs API)
└── README.md      # This file
```

## Features

- Multi-language support for patients
- Real-time translation of appointment details
- Automated doctor appointment scheduling
- User-friendly localized interface

## Technology Stack

- **Frontend**: UI for language selection and appointment form
- **Translation**: Google Gemini API for language translation
- **Appointments**: ElevenLabs API for booking doctor appointments

## Getting Started

(Add setup instructions for each component as needed)
