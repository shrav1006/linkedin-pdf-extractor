import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import { pdfBufferToText } from "../utils/pdfToText.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Azure OpenAI client (OpenAI SDK configured for Azure)
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});

async function extractWithAzureOpenAI(rawText) {
  const system = `You extract structured profile data from LinkedIn profile PDFs.
Return ONLY valid JSON. No markdown. No comments. No extra keys.
If a field is missing, use "" for strings and [] for arrays.

Return JSON with exactly these keys:
name, headline, location, about, email, phone, links, skills, education, experience, certifications, projects

education item keys: school, degree, field, start, end
experience item keys: title, company, location, start, end, description
`;

  // Keep input bounded to reduce failures (token/timeouts)
  const trimmed = rawText.length > 18000 ? rawText.slice(0, 18000) : rawText;

  const user = `Extract profile data from this text:\n\n${trimmed}`;

  // Attempt 1: response_format json_object (widely supported)
  try {
    const resp = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    });

    const content = resp.choices?.[0]?.message?.content || "";
    const parsed = safeJsonParse(content);
    if (!parsed) throw new Error("Azure returned non-JSON content: " + content.slice(0, 200));
    return parsed;
  } catch (e) {
    console.error("❌ Azure attempt1 error:", e?.response?.data || e?.message || e);

    // Attempt 2: no response_format; brutally force JSON only
    const resp = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      temperature: 0,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content:
            user +
            `\n\nSTRICT OUTPUT RULES:
- Output must start with '{' and end with '}'.
- Do not wrap in triple backticks.
- Do not output anything outside JSON.`,
        },
      ],
    });

    const content = resp.choices?.[0]?.message?.content || "";
    const parsed = safeJsonParse(content);
    if (!parsed) {
      console.error("❌ Azure attempt2 raw output (first 300):", content.slice(0, 300));
      throw new Error("Failed to parse Azure output as JSON. Raw: " + content.slice(0, 200));
    }
    return parsed;
  }
}

router.post("/extract", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await pdfBufferToText(req.file.buffer);

    if (!text || text.length < 50) {
      return res.status(422).json({
        error:
          "Extracted text is empty/too small. PDF may be scanned image or protected (needs OCR).",
      });
    }

    const structured = await extractWithAzureOpenAI(text);

    res.json({
      ok: true,
      data: structured,
      meta: { extractedTextLength: text.length },
    });
  } catch (e) {
    console.error("🔥 /api/linkedin/extract ERROR:", e?.response?.data || e);
    res.status(500).json({
      ok: false,
      error: e.message,
      azure: e?.response?.data || null,
    });
  }
});

export default router;