import { GoogleGenAI } from "@google/genai";
import { readJsonBody } from "../utils/request.js";
import { toolDeclarations, executeTool } from "../ai/tools.js";
import {
    buildContextualSystemInstruction,
    trimConversationHistory,
} from "../ai/knowledgeBase.js";
import { STREAM_CONFIG } from "../config/aiConfig.js";
import { SLIM_SYSTEM_INSTRUCTION } from "./geminiStream.js";

let ai = null;
function getAi() {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

const MAX_TOOL_ITERATIONS = 5;

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

        const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
        const trimmedMessages = trimConversationHistory(
            messages,
            STREAM_CONFIG.MAX_HISTORY_MESSAGES
        );
        const systemInstruction = buildContextualSystemInstruction(
            SLIM_SYSTEM_INSTRUCTION,
            trimmedMessages
        );
        const currentContents = [...trimmedMessages];

        let iterations = 0;
        let lastProposal = null;
        let lastAction = null;
        let finalResponseText = "";

        while (iterations < MAX_TOOL_ITERATIONS) {
            iterations++;

            const response = await getAi().models.generateContent({
                model: modelName,
                contents: currentContents,
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: toolDeclarations }],
                },
            });

            const candidate = response.candidates?.[0];
            const content = candidate?.content;
            const functionCalls = response.functionCalls || [];

            if (!functionCalls || functionCalls.length === 0) {
                finalResponseText = response.text || "";
                break;
            }

            // Append assistant model turn containing the function calls
            currentContents.push(content);

            // Execute all requested tool calls
            const functionResponseParts = [];
            for (const call of functionCalls) {
                const toolResult = await executeTool(call.name, call.args);

                if (toolResult?.action === "RENDER_PROPOSAL" && toolResult?.proposal) {
                    lastProposal = toolResult.proposal;
                    lastAction = "PROPOSAL_CREATED";
                }
                if (toolResult?.action === "FORM_SUBMITTED") {
                    lastAction = "FORM_SUBMITTED";
                }

                functionResponseParts.push({
                    functionResponse: {
                        name: call.name,
                        response: toolResult,
                    },
                });
            }

            // Append tool execution responses
            currentContents.push({
                role: "tool",
                parts: functionResponseParts,
            });
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                text: finalResponseText,
                action: lastAction,
                proposal: lastProposal,
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
