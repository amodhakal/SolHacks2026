import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

const MAX_RETRIES = 10;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateDelayWithJitter(attempt: number): number {
  const exponentialDelay = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * exponentialDelay;
  return Math.min(jitter, MAX_DELAY_MS);
}

export async function translateFromEnglish(
  text: string,
  targetLanguage: string,
): Promise<string> {
  if (!text || text.trim() === "") {
    return text;
  }

  const prompt = `You are a medical appointment translator. Translate the following appointment confirmation message from English to ${targetLanguage}. Translate it naturally as a professional email confirmation.

Original English message:
${text}

Return ONLY the translated message in ${targetLanguage}, formatted as a professional email confirmation. Do not include any explanation or additional text.`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const content = response.text?.trim() || "";

      return content;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Translation attempt ${attempt + 1} failed:`,
        lastError.message,
      );

      if (attempt < MAX_RETRIES - 1) {
        const delay = calculateDelayWithJitter(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `Translation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`,
  );
}
