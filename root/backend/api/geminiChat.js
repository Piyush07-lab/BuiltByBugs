const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are a helpful and professional AI assistant for BuiltByBugs website by Piyush Mishra.
Your goal is to assist visitors, answer questions about Piyush's work, experience, and services. 
Be polite, concise, and enthusiastic.`;

async function handleGeminiChat(req, res) {
    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        try {
            const data = JSON.parse(body);
            const { messages } = data; // Expected: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]

            if (!messages || !Array.isArray(messages)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid messages format" }));
            }

            const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash-lite',
                contents: messages,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
                }
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                text: response.text
            }));
        } catch (error) {
            console.error("[Gemini API Error]", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to generate AI response" }));
        }
    });
}

module.exports = { handleGeminiChat };
