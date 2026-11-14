import { GoogleGenAI } from "@google/genai";
import { toolDeclarations, executeTool } from "../ai/tools.js";
import {
    buildContextualSystemInstruction,
    trimConversationHistory,
} from "../ai/knowledgeBase.js";
import {
    formatManagedError,
    getCandidateModels,
    markModelFailure,
    markModelSuccess,
    validateModelTurnOutput,
} from "../ai/modelPool.js";
import { STREAM_CONFIG } from "../config/aiConfig.js";

let ai = null;
/**
 * Lazily initializes and caches the GoogleGenAI client, enabling Vertex AI Express
 * mode automatically when GOOGLE_GENAI_USE_VERTEXAI=true or using an AQ. API key.
 */
export function getAi() {
    if (!ai) {
        const apiKey = process.env.GEMINI_API_KEY;
        const useVertexAi =
            process.env.GOOGLE_GENAI_USE_VERTEXAI === "true" ||
            String(apiKey || "").startsWith("AQ.");

        ai = new GoogleGenAI(useVertexAi ? { apiKey, vertexai: true } : { apiKey });
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
    submitInquiry: "Validating & submitting inquiry...",
};

function getToolStatusLabel(toolName) {
    return TOOL_STATUS_LABELS[toolName] || `Running ${toolName}...`;
}

/**
 * Executes a batch of Gemini function calls concurrently while preserving part order.
 */
export async function executeToolCalls(calls, onBeforeRun) {
    const executions = await Promise.all(
        calls.map(async (call) => {
            onBeforeRun?.(call);
            const toolResult = await executeTool(call.name, call.args);
            return { call, toolResult };
        })
    );

    const functionResponseParts = [];
    let action = null;
    let proposal = null;

    for (const { call, toolResult } of executions) {
        if (toolResult?.action === "RENDER_PROPOSAL" && toolResult?.proposal) {
            proposal = toolResult.proposal;
            action = "PROPOSAL_CREATED";
        }
        if (toolResult?.action === "FORM_SUBMITTED") {
            action = "FORM_SUBMITTED";
        }

        functionResponseParts.push({
            functionResponse: {
                name: call.name,
                response: toolResult,
            },
        });
    }

    return { functionResponseParts, action, proposal };
}

/**
 * Streams a Gemini response with multi-model pool failover, response validation,
 * and multi-turn tool calling.
 */
export async function streamGeminiResponse({ messages, sendFrame, aiClient = getAi() }) {
    const trimmedMessages = trimConversationHistory(
        messages,
        STREAM_CONFIG.MAX_HISTORY_MESSAGES
    );
    const systemInstruction = buildContextualSystemInstruction(
        SLIM_SYSTEM_INSTRUCTION,
        trimmedMessages
    );
    const currentContents = [...trimmedMessages];

    sendFrame({ type: "stream:start" });

    let iterations = 0;
    let fullText = "";
    let lastProposal = null;
    let lastAction = null;
    let activeModel = null;

    while (iterations < MAX_TOOL_ITERATIONS) {
        iterations++;

        const candidates = getCandidateModels();
        let turnResult = null;
        let lastPoolError = null;

        for (let i = 0; i < candidates.length; i++) {
            const candidateModel = candidates[i];
            let attemptText = "";
            const attemptCalls = [];
            const attemptModelParts = [];
            let lastCandidate = null;
            let emittedChunksForAttempt = false;

            try {
                const stream = await aiClient.models.generateContentStream({
                    model: candidateModel,
                    contents: currentContents,
                    config: {
                        systemInstruction,
                        tools: [{ functionDeclarations: toolDeclarations }],
                    },
                });

                for await (const chunk of stream) {
                    const candidate = chunk.candidates?.[0];
                    if (candidate) {
                        lastCandidate = candidate;
                    }

                    const parts = candidate?.content?.parts || [];
                    for (const part of parts) {
                        if (part?.functionCall) {
                            attemptCalls.push(part.functionCall);
                            attemptModelParts.push(part);
                        }
                    }

                    if (
                        parts.length === 0 &&
                        Array.isArray(chunk.functionCalls) &&
                        chunk.functionCalls.length > 0
                    ) {
                        for (const call of chunk.functionCalls) {
                            attemptCalls.push(call);
                            attemptModelParts.push({ functionCall: call });
                        }
                    }

                    if (chunk.text) {
                        attemptText += chunk.text;
                        if (attemptText.trim().length > 0) {
                            if (!emittedChunksForAttempt) {
                                emittedChunksForAttempt = true;
                                fullText += attemptText;
                                sendFrame({ type: "stream:chunk", delta: attemptText });
                            } else {
                                fullText += chunk.text;
                                sendFrame({ type: "stream:chunk", delta: chunk.text });
                            }
                        }
                    }
                }

                const validation = validateModelTurnOutput({
                    text: attemptText,
                    functionCalls: attemptCalls,
                    candidate: lastCandidate,
                });

                if (!validation.valid) {
                    const validationErr = new Error(validation.reason);
                    validationErr.code = validation.code;
                    throw validationErr;
                }

                markModelSuccess(candidateModel);
                activeModel = candidateModel;
                turnResult = {
                    collectedCalls: attemptCalls,
                    collectedModelParts: attemptModelParts,
                };
                break;
            } catch (err) {
                const failure = markModelFailure(candidateModel, err);
                const hasMoreModels = i < candidates.length - 1;
                lastPoolError = Object.assign(new Error(failure.reason), {
                    code:
                        !hasMoreModels && failure.retryable
                            ? "ALL_MODELS_EXHAUSTED"
                            : failure.code,
                    userMessage: failure.userMessage,
                    retryable: failure.retryable,
                    cause: err,
                });

                if (!emittedChunksForAttempt && failure.retryable && hasMoreModels) {
                    sendFrame({
                        type: "stream:status",
                        label: "Primary model busy, switching to backup model...",
                    });
                    continue;
                }

                throw lastPoolError;
            }
        }

        if (!turnResult) {
            throw lastPoolError || new Error("No models available in pool");
        }

        if (turnResult.collectedCalls.length === 0) {
            break;
        }

        currentContents.push({
            role: "model",
            parts: turnResult.collectedModelParts,
        });

        const { functionResponseParts, action, proposal } = await executeToolCalls(
            turnResult.collectedCalls,
            (call) =>
                sendFrame({
                    type: "stream:status",
                    tool: call.name,
                    label: getToolStatusLabel(call.name),
                })
        );

        if (proposal) lastProposal = proposal;
        if (action) lastAction = action;

        currentContents.push({
            role: "tool",
            parts: functionResponseParts,
        });
    }

    sendFrame({
        type: "stream:end",
        text: fullText,
        action: lastAction,
        proposal: lastProposal,
        model: activeModel,
    });

    return {
        text: fullText,
        action: lastAction,
        proposal: lastProposal,
        model: activeModel,
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
    sendFrame({ type: "stream:ready", models: getCandidateModels() });

    ws.on("message", async (rawData) => {
        resetIdleTimer();

        let payload;
        try {
            payload = JSON.parse(rawData.toString());
        } catch {
            sendFrame({
                type: "stream:error",
                code: "INVALID_JSON",
                error: "INVALID_JSON",
                message: "Invalid JSON payload",
                retryable: false,
            });
            return;
        }

        if (payload?.type === "ping") {
            sendFrame({ type: "pong" });
            return;
        }

        if (payload?.type === "chat:init") {
            sendFrame({ type: "stream:ready", models: getCandidateModels() });
            return;
        }

        if (payload?.type !== "chat:message") {
            sendFrame({
                type: "stream:error",
                code: "UNSUPPORTED_FRAME",
                error: "UNSUPPORTED_FRAME",
                message: `Unsupported frame type: ${payload?.type || "unknown"}`,
                retryable: false,
            });
            return;
        }

        if (!Array.isArray(payload.messages)) {
            sendFrame({
                type: "stream:error",
                code: "INVALID_MESSAGES",
                error: "INVALID_MESSAGES",
                message: "Invalid messages format",
                retryable: false,
            });
            return;
        }

        try {
            await streamGeminiResponse({
                messages: payload.messages,
                sendFrame,
            });
        } catch (error) {
            console.error("[Gemini Stream Error]", error);
            const managed = formatManagedError(error);
            sendFrame({
                type: "stream:error",
                code: managed.code,
                error: managed.code,
                message: managed.message,
                retryable: managed.retryable,
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
