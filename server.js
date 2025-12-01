import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.warn("[WARN] OPENROUTER_API_KEY is not set. Add it to .env");
}

const REFERER = process.env.APP_REFERER || "http://localhost:3000";
const APP_TITLE = process.env.APP_TITLE || "JobFinder";
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "deepseek/deepseek-chat-v3.1:free";

const SYSTEM_PROMPT = `You are JobFinder, a job search coach and talent assistant.
When given a set of qualifications, return a practical, step-by-step job-finding plan: ideal roles, skill gaps, portfolio ideas, networking scripts, and a 30-60-90 day plan. Keep answers crisp with bullets and short paragraphs.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const finalMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model || DEFAULT_MODEL,
        messages: finalMessages
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": REFERER,
          "X-Title": APP_TITLE
        },
        timeout: 60000
      }
    );

    const choice = response?.data?.choices?.[0];
    const text = choice?.message?.content ?? "";
    res.json({ content: text });
  } catch (err) {
    console.error("OpenRouter error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Model request failed",
      details: err?.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JobFinder running on http://localhost:${PORT}`);
});
