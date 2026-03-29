import express from "express";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
const PORT = 3500;

app.use(cors());
app.use(express.json());

app.get("/hitAPI", async (req, res) => {
  try {
    console.log("OKAY");
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What is 3 + 3?",
    });

    console.log(response);
    res.json({
      reply: response,
    });
  } catch (error) {
    console.error("Endpoint processing error:", error);
    res.status(500).json({
      reply: "Sorry, I encountered an error processing your request.",
    });
  }
});

app.get("/test", async (req, res) => {
  try {
    console.log("RECEIVED");
    res.status(500).json({
      reply: "OKAY",
    });
  } catch (error) {
    console.error("ENDPOINT PROCESSING ERROR.");
    res.status(500).json({
      reply: "WRONG",
    });
  }
});

//Start express server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
