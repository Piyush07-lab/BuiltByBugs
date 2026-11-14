import { GoogleGenAI } from "@google/genai";
import { toolDeclarations, executeTool } from "../ai/tools.js";
import {
    buildContextualSystemInstruction,
    trimConversationHistory
} from "../ai/knowledgeBase.js";
import { STREAM_CONFIG } from "../config/aiConfig.js";

let ai = null;
function getAi() {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

export const SLIM_SYSTEM_INSTRUCTION = `You are the BuiltByBugs AI Site & Creator Assistant representing Piyush Mishra.
Roles:
1. Site Assistant: Answer questions on skills, projects, articles, and live coding metrics using getSiteKnowledge, getCodingStats, and getGitHubProjects.
2. Conversational Forms: Gather full name, email, service category ('Full-Time Job', 'Contract', 'Standalone Projects', 'Web Services'), and details; confirm before calling submitInquiry.
3. Proposal Generator: Synthesize client requirements into milestones and tech stacks via draftProjectProposal.
4. Negotiation Policy: Evaluate any discount or budget counter-offer with evaluateNegotiation. Never reduce price without scope or timeline trade-offs. Escalate to Piyush if below floor or out of scope.
5. Creator Assistant: Help Piyush review proposals, summarize client conversations, and manage policies when requested.
Be technically sharp, concise, and professional.`;

const MAX_TOOL_ITERATIONS = 5;

const TOOL_STATUS_LABELS = {
    getSiteKnowledge: "Checking site knowledge base...",
    getCodingStats: "Fetching live WakaTime & LeetCode stats...",
    getGitHubProjects: "Inspecting GitHub repositories...",
    evaluateNegotiation: "Evaluating project bounds & trade-offs...",
    draftProjectProposal: "Generating structured project proposal...",
    submitInquiry: "Validating & submitting inquiry..."
};

function getToolStatusLabel(toolName) {
    return TOOL_STATUS_LABELS[toolName] || `Running ${toolName}...`;
}

/**
 * Streams a Gemini response with multi-turn tool calling and token-optimized context.
 */
export async function streamGeminiResponse({ messages, sendFrame, aiClient = getAi() }) {
    const trimmedMessages = trimConversationHistory(messages, STREAM_CONFIG.MAX_HISTORY_MESSAGES);
    const systemInstruction = buildContextualSystemInstruction(
        SLIM_SYSTEM_INSTRUCTION,
        trimmedMessages
    );
    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const currentContents = [...trimmedMessages];

    sendFrame({ type: "stream:start" });

    let iterations = 0;
    let fullText = "";
    let lastProposal = null;
    let lastAction = null;

    while (iterations < MAX_TOOL_ITERATIONS) {
        iterations++;

        const stream = await aiClient.models.generateContentStream({
            model: modelName,
            contents: currentContents,
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: toolDeclarations }]
            }
        });

        const collectedCalls = [];
        const collectedModelParts = [];

        for await (const chunk of stream) {
            const parts = chunk.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part?.functionCall) {
                    collectedCalls.push(part.functionCall);
                    collectedModelParts.push(part);
                }
            }

            if (
                parts.length === 0 &&
                Array.isArray(chunk.functionCalls) &&
                chunk.functionCalls.length > 0
            ) {
                for (const call of chunk.functionCalls) {
                    collectedCalls.push(call);
                    collectedModelParts.push({ functionCall: call });
                }
            }

            if (chunk.text) {
                fullText += chunk.text;
                sendFrame({ type: "stream:chunk", delta: chunk.text });
            }
        }

        if (collectedCalls.length === 0) {
            break;
        }

        currentContents.push({
            role: "model",
            parts: collectedModelParts
        });

        const functionResponseParts = [];
        for (const call of collectedCalls) {
            sendFrame({
                type: "stream:status",
                tool: call.name,
                label: getToolStatusLabel(call.name)
            });

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
                    response: toolResult
                }
            });
        }

        currentContents.push({
            role: "tool",
            parts: functionResponseParts
        });
    }

    sendFrame({
        type: "stream:end",
        text: fullText,
        action: lastAction,
        proposal: lastProposal
    });

    return {
        text: fullText,
        action: lastAction,
        proposal: lastProposal
    };
}

/**
 * Attaches WebSocket message and Cloud Run idle-timeout handling to a socket.
 */
export function handleChatWebSocket(ws, _req) {
    let idleTimer = null;

    const sendFrame = (payload) => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(payload));
        }
    };

    const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (ws.readyState === 1) {
                ws.close(1000, "Idle timeout");
            }
        }, STREAM_CONFIG.IDLE_TIMEOUT_MS);
        if (typeof idleTimer.unref === "function") {
            idleTimer.unref();
        }
    };

    resetIdleTimer();

    ws.on("message", async (rawData) => {
        resetIdleTimer();

        let payload;
        try {
            payload = JSON.parse(rawData.toString());
        } catch {
            sendFrame({
                type: "stream:error",
                error: "Invalid JSON payload"
            });
            return;
        }

        if (payload?.type === "ping") {
            sendFrame({ type: "pong" });
            return;
        }

        if (payload?.type !== "chat:message") {
            sendFrame({
                type: "stream:error",
                error: `Unsupported frame type: ${payload?.type || "unknown"}`
            });
            return;
        }

        if (!Array.isArray(payload.messages)) {
            sendFrame({
                type: "stream:error",
                error: "Invalid messages format"
            });
            return;
        }

        try {
            await streamGeminiResponse({
                messages: payload.messages,
                sendFrame
            });
        } catch (error) {
            console.error("[Gemini Stream Error]", error);
            sendFrame({
                type: "stream:error",
                error: "Failed to generate AI response",
                message: error.message
            });
        }
    });

    ws.on("close", () => {
        if (idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
        }
    });
}
