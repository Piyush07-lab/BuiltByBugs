import { readJsonBody } from "../utils/request.js";
import { toolDeclarations } from "../ai/tools.js";
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
import { executeToolCalls, getAi, SLIM_SYSTEM_INSTRUCTION } from "./geminiStream.js";

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
        let activeModel = null;

        while (iterations < MAX_TOOL_ITERATIONS) {
            iterations++;

            const candidates = getCandidateModels();
            let selectedResponse = null;
            let lastPoolError = null;

            for (let i = 0; i < candidates.length; i++) {
                const candidateModel = candidates[i];
                try {
                    const response = await getAi().models.generateContent({
                        model: candidateModel,
                        contents: currentContents,
                        config: {
                            systemInstruction,
                            tools: [{ functionDeclarations: toolDeclarations }],
                        },
                    });

                    const candidate = response.candidates?.[0];
                    const functionCalls = response.functionCalls || [];
                    const text = response.text || "";

                    const validation = validateModelTurnOutput({
                        text,
                        functionCalls,
                        candidate,
                    });

                    if (!validation.valid) {
                        const validationErr = new Error(validation.reason);
                        validationErr.code = validation.code;
                        throw validationErr;
                    }

                    markModelSuccess(candidateModel);
                    activeModel = candidateModel;
                    selectedResponse = {
                        content: candidate?.content,
                        functionCalls,
                        text,
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

                    if (failure.retryable && hasMoreModels) {
                        continue;
                    }
                    throw lastPoolError;
                }
            }

            if (!selectedResponse) {
                throw lastPoolError || new Error("No models available in pool");
            }

            if (selectedResponse.functionCalls.length === 0) {
                finalResponseText = selectedResponse.text;
                break;
            }

            // Append assistant model turn containing the function calls
            currentContents.push(selectedResponse.content);

            // Execute all requested tool calls concurrently while preserving response order
            const { functionResponseParts, action, proposal } = await executeToolCalls(
                selectedResponse.functionCalls
            );
            if (proposal) lastProposal = proposal;
            if (action) lastAction = action;

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
                model: activeModel,
            })
        );
    } catch (error) {
        console.error("[Gemini API Error]", error);
        const managed = formatManagedError(error);
        if (!res.headersSent) {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: managed.code,
                    code: managed.code,
                    message: managed.message,
                    retryable: managed.retryable,
                })
            );
        }
    }
}

export { handleGeminiChat };
