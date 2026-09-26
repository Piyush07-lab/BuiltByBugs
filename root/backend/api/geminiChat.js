import { GoogleGenAI } from "@google/genai";
import { readJsonBody } from "../utils/request.js";

let ai = null;
function getAi() {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

const SYSTEM_INSTRUCTION = `You are a helpful and professional AI assistant for BuiltByBugs website by Piyush Mishra.
Your goal is to assist visitors, answer questions about Piyush's work, experience, and services. 
Be polite, concise, and enthusiastic.`;

async function handleGeminiChat(req, res) {
    if (req.method !== "POST") {
        res.writeHead(405, {
            "Content-Type": "application/json",
            Allow: "POST, OPTIONS",
        });
        return res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }

    const data = await readJsonBody(req, res, 512 * 1024);
    if (!data) return;

    try {
        const { messages } = data; // Expected: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]

        if (!messages || !Array.isArray(messages)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid messages format" }));
        }

        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const response = await getAi().models.generateContent({
            model: modelName,
            contents: messages,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                text: response.text,
            })
        );
    } catch (error) {
        console.error("[Gemini API Error]", error);
        if (!res.headersSent) {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Failed to generate AI response",
                    message: error.message,
                })
            );
        }
    }
}

export { handleGeminiChat };
