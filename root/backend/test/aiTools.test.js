import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { CREATOR_PROFILE } from "../config/aiConfig.js";
import {
    SITE_KNOWLEDGE,
    sliceContextForPrompt,
    trimConversationHistory,
} from "../ai/knowledgeBase.js";
import { executeTool, parseAmount } from "../ai/tools.js";
import {
    getCandidateModels,
    markModelFailure,
    resetModelPoolHealth,
    validateModelTurnOutput,
} from "../ai/modelPool.js";
import {
    enableVertexAiFallback,
    getAi,
    isVertexAiEnabled,
    resetAiClientState,
    streamGeminiResponse,
    tryEnableVertexFallbackOnAuth,
} from "../api/geminiStream.js";

describe("AI System Tools Suite", () => {
    it("should retrieve site knowledge for articles and creator", async () => {
        const response = await executeTool("getSiteKnowledge", {
            category: "articles",
            query: "AST",
        });

        assert.equal(response.status, "success");
        assert.ok(response.result.articles.length > 0);
        assert.equal(response.result.articles[0].slug, "ast-linters");
    });

    it("should evaluate negotiation within acceptable bounds", async () => {
        const response = await executeTool("evaluateNegotiation", {
            proposedBudget: 1500,
            proposedHours: 20,
            timelineDays: 14,
            scopeDescription: "Build a microservice with RabbitMQ queue and REST API.",
            isUpfrontPaymentAgreed: true,
        });

        assert.equal(response.status, "success");
        assert.equal(response.result.status, "within_bounds");
        assert.equal(response.result.escalateToCreator, false);
        assert.ok(
            response.result.tradeoffsRequired.some((t) => t.includes("5% upfront"))
        );
    });

    it("should flag negotiation below floor for human escalation", async () => {
        const expectedFloor = 300;
        const response = await executeTool("evaluateNegotiation", {
            proposedBudget: 100, // Below floor
            scopeDescription: "Build a complete web app with auth and billing",
        });

        assert.equal(response.status, "success");
        assert.equal(response.result.status, "below_floor");
        assert.equal(response.result.escalateToCreator, true);
        assert.equal(response.result.counterOffer.acceptableMinimumBudget, expectedFloor);
    });

    it("should flag INR negotiation below INR floor using index [1]", async () => {
        const response = await executeTool("evaluateNegotiation", {
            proposedBudget: 15000,
            currency: "INR",
            scopeDescription: "Build a full-stack e-commerce API",
        });

        assert.equal(response.status, "success");
        assert.equal(response.result.currency, "INR");
        assert.equal(response.result.status, "below_floor");
        assert.equal(response.result.escalateToCreator, true);
        assert.equal(response.result.counterOffer.acceptableMinimumBudget, 25000);
        assert.ok(response.result.reason.includes("₹15000"));
        assert.ok(response.result.reason.includes("₹25000"));
    });

    it("should draft a structured project proposal with milestones", async () => {
        const response = await executeTool("draftProjectProposal", {
            clientName: "Acme Corp",
            projectName: "Distributed Order Processing System",
            summary: "High-throughput order processing using Node.js and RabbitMQ",
            recommendedStack: ["Node.js", "RabbitMQ", "MongoDB", "Docker"],
            deliverables: [
                {
                    title: "Core Message Broker Setup",
                    description: "RabbitMQ exchange & queue topology",
                    estimatedDays: 3,
                },
                {
                    title: "Order Ingestion API",
                    description: "Express REST endpoints with rate limiting",
                    estimatedDays: 4,
                },
                {
                    title: "Worker Consumers",
                    description: "Background workers handling async state updates",
                    estimatedDays: 5,
                },
            ],
            timelineWeeks: 3,
            totalEstimatedCost: 2000,
            billingType: "Milestone-Based",
        });

        assert.equal(response.status, "success");
        assert.equal(response.action, "RENDER_PROPOSAL");
        assert.ok(response.proposal.proposalId.startsWith("BBB-PROP-"));
        assert.equal(response.proposal.milestones.length, 3);
        assert.equal(response.proposal.totalEstimatedCost, 2000);
        assert.equal(response.proposal.milestones[0].amount, 800); // 40% of 2000
    });

    it("should validate and simulate inquiry submission", async () => {
        const response = await executeTool("submitInquiry", {
            type: "hire",
            service: "Standalone Projects",
            name: "Sarah Connor",
            email: "sarah@skynet-defense.com",
            details:
                "Need a fault-tolerant monitoring daemon built with Node.js and automated alerting.",
        });

        assert.equal(response.status, "success");
        assert.equal(response.action, "FORM_SUBMITTED");
        assert.ok(
            response.message.includes("Sarah Connor") ||
                response.message.includes("successfully")
        );
    });

    it("should reject spam inquiry submission", async () => {
        const response = await executeTool("submitInquiry", {
            type: "hire",
            service: "Standalone Projects",
            name: "Bot Spammer",
            email: "spam@example.com",
            details: "buy followers and crypto quick loan services",
        });

        assert.equal(response.status, "validation_error");
        assert.equal(response.error, "Spam detected");
    });

    it("should confirm all configured creator and site knowledge prices", async () => {
        assert.deepEqual(CREATOR_PROFILE.pricing.hourlyRate, {
            floor: ["$15", "₹1400"],
            target: ["$25", "₹2200"],
            ceiling: ["$40", "₹3500"],
        });
        assert.deepEqual(CREATOR_PROFILE.pricing.fixedProjectFloor, ["$300", "₹25000"]);
        assert.deepEqual(CREATOR_PROFILE.pricing.servicePackages, {
            standaloneProjects: ["$250+", "₹22000"],
            webServices: ["$100+", "₹9100+"],
            contractRetainer: ["$350/month", "₹35000/month"],
        });

        assert.deepEqual(CREATOR_PROFILE.negotiationPolicy.hourlyRate, {
            floor: ["$12", "₹999"],
            target: ["$25", "₹2200"],
            ceiling: ["$50", "₹4800"],
        });
        assert.deepEqual(CREATOR_PROFILE.negotiationPolicy.fixedProjectFloor, [
            "$300",
            "₹25000",
        ]);

        assert.deepEqual(SITE_KNOWLEDGE.pricing, {
            hourlyRateRange: "$15 - $40",
            standaloneProjectStarting: "$300+",
            webServicesStarting: "$50+",
            contractRetainerMonthly: "$350+ / month",
            customNotes: "No service below $15",
        });

        const knowledgeResponse = await executeTool("getSiteKnowledge", {
            category: "pricing",
        });
        assert.equal(knowledgeResponse.status, "success");
        assert.deepEqual(knowledgeResponse.result.pricing, {
            ...SITE_KNOWLEDGE.pricing,
            ...CREATOR_PROFILE.pricing,
        });

        assert.equal(
            parseAmount(CREATOR_PROFILE.negotiationPolicy.fixedProjectFloor, "USD"),
            300
        );
        assert.equal(
            parseAmount(CREATOR_PROFILE.negotiationPolicy.fixedProjectFloor, "INR"),
            25000
        );
        assert.equal(
            parseAmount(CREATOR_PROFILE.negotiationPolicy.hourlyRate.floor, "USD"),
            12
        );
        assert.equal(
            parseAmount(CREATOR_PROFILE.negotiationPolicy.hourlyRate.floor, "INR"),
            999
        );
    });

    it("should slice only relevant context modules and trim conversation history", () => {
        const sliced = sliceContextForPrompt("Tell me about Piyush's articles on AST");
        assert.ok(sliced.matchedKeys.includes("articles"));
        assert.ok(!sliced.matchedKeys.includes("pricing"));

        const longHistory = Array.from({ length: 15 }, (_, idx) => ({
            role: idx % 2 === 0 ? "user" : "model",
            parts: [{ text: `Message ${idx + 1}` }],
        }));
        const trimmed = trimConversationHistory(longHistory, 10);
        assert.equal(trimmed.length, 10);
        assert.equal(trimmed[0].parts[0].text, "Message 6");
    });

    it("should stream Gemini chunks and execute tool calls mid-stream", async () => {
        let turnCount = 0;
        const mockAiClient = {
            models: {
                async generateContentStream() {
                    turnCount++;
                    if (turnCount === 1) {
                        return (async function* () {
                            yield {
                                candidates: [
                                    {
                                        content: {
                                            parts: [
                                                {
                                                    functionCall: {
                                                        name: "getSiteKnowledge",
                                                        args: {
                                                            category: "articles",
                                                            query: "AST",
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            };
                        })();
                    }

                    return (async function* () {
                        yield { text: "Piyush wrote " };
                        yield { text: "about AST linters." };
                    })();
                },
            },
        };

        const frames = [];
        const result = await streamGeminiResponse({
            messages: [{ role: "user", parts: [{ text: "Tell me about AST articles" }] }],
            sendFrame: (frame) => frames.push(frame),
            aiClient: mockAiClient,
        });

        assert.equal(frames[0].type, "stream:start");
        assert.ok(
            frames.some(
                (f) => f.type === "stream:status" && f.tool === "getSiteKnowledge"
            )
        );
        const chunks = frames
            .filter((f) => f.type === "stream:chunk")
            .map((f) => f.delta);
        assert.deepEqual(chunks, ["Piyush wrote ", "about AST linters."]);
        assert.equal(frames[frames.length - 1].type, "stream:end");
        assert.equal(result.text, "Piyush wrote about AST linters.");
    });

    it("should automatically fail over across the model pool when models fail or return empty responses", async () => {
        resetModelPoolHealth();
        try {
            const expectedOrder = getCandidateModels();
            assert.ok(expectedOrder.length >= 3);

            const attemptedModels = [];
            const mockAiClient = {
                models: {
                    async generateContentStream({ model }) {
                        attemptedModels.push(model);
                        if (attemptedModels.length === 1) {
                            const err = new Error("429 RESOURCE_EXHAUSTED: model is out");
                            err.status = 429;
                            throw err;
                        }
                        if (attemptedModels.length === 2) {
                            return (async function* () {
                                yield { text: "   " };
                            })();
                        }
                        return (async function* () {
                            yield { text: "Recovered from backup model." };
                        })();
                    },
                },
            };

            const frames = [];
            const result = await streamGeminiResponse({
                messages: [{ role: "user", parts: [{ text: "Hello" }] }],
                sendFrame: (frame) => frames.push(frame),
                aiClient: mockAiClient,
            });

            assert.deepEqual(attemptedModels, expectedOrder.slice(0, 3));
            assert.ok(
                frames.some(
                    (f) =>
                        f.type === "stream:status" &&
                        f.label.includes("switching to backup model")
                )
            );
            assert.equal(result.text, "Recovered from backup model.");
            assert.equal(result.model, expectedOrder[2]);
            assert.equal(getCandidateModels()[0], expectedOrder[2]);
        } finally {
            resetModelPoolHealth();
        }
    });

    it("should validate model turn outputs with validateModelTurnOutput", () => {
        assert.equal(validateModelTurnOutput({ text: "Valid reply" }).valid, true);
        assert.equal(
            validateModelTurnOutput({
                text: "",
                functionCalls: [{ name: "getSiteKnowledge", args: {} }],
            }).valid,
            true
        );

        const emptyCheck = validateModelTurnOutput({ text: "   ", functionCalls: [] });
        assert.equal(emptyCheck.valid, false);
        assert.equal(emptyCheck.retryable, true);

        const blockedCheck = validateModelTurnOutput({
            text: "Blocked",
            candidate: { finishReason: "SAFETY" },
        });
        assert.equal(blockedCheck.valid, false);
        assert.equal(blockedCheck.retryable, true);
    });

    it("should classify 403 publisher model access errors as MODEL_NOT_FOUND and fail over", async () => {
        resetModelPoolHealth();
        try {
            const expectedOrder = getCandidateModels();
            const publisherErr = Object.assign(
                new Error(
                    "Publisher Model 'publishers/google/models/gemini-3.5-flash-lite' was not found or your project does not have access to it."
                ),
                { status: 403 }
            );

            const classification = markModelFailure(expectedOrder[0], publisherErr);
            assert.equal(classification.code, "MODEL_NOT_FOUND");
            assert.equal(classification.retryable, true);

            resetModelPoolHealth();
            const attemptedModels = [];
            const mockAiClient = {
                models: {
                    async generateContentStream({ model }) {
                        attemptedModels.push(model);
                        if (attemptedModels.length === 1) {
                            throw publisherErr;
                        }
                        return (async function* () {
                            yield { text: "Fallback succeeded after 403 model error." };
                        })();
                    },
                },
            };

            const frames = [];
            const result = await streamGeminiResponse({
                messages: [{ role: "user", parts: [{ text: "Hi" }] }],
                sendFrame: (frame) => frames.push(frame),
                aiClient: mockAiClient,
            });

            assert.deepEqual(attemptedModels, expectedOrder.slice(0, 2));
            assert.equal(result.model, expectedOrder[1]);
            assert.equal(result.text, "Fallback succeeded after 403 model error.");
        } finally {
            resetModelPoolHealth();
        }
    });

    it("should default vertexai to false and switch to true via enableVertexAiFallback on auth error", () => {
        const prevUseVertex = process.env.GOOGLE_GENAI_USE_VERTEXAI;
        const prevApiKey = process.env.GEMINI_API_KEY;
        resetModelPoolHealth();

        try {
            process.env.GOOGLE_GENAI_USE_VERTEXAI = "false";
            process.env.GEMINI_API_KEY = "AQ.test-key";
            resetAiClientState();

            assert.equal(isVertexAiEnabled(), false);
            assert.equal(getAi().vertexai, false);

            const primaryModel = getCandidateModels()[0];
            const authErr = Object.assign(
                new Error("401 UNAUTHENTICATED: API key not valid"),
                { status: 401 }
            );
            const failure = markModelFailure(primaryModel, authErr);
            assert.equal(failure.code, "AUTH_ERROR");

            const switched = tryEnableVertexFallbackOnAuth({
                candidateModel: primaryModel,
                failure,
                alreadyAttemptedForModel: false,
            });

            assert.equal(switched, true);
            assert.equal(isVertexAiEnabled(), true);
            assert.equal(getAi().vertexai, true);
            assert.equal(enableVertexAiFallback().vertexai, true);
            assert.equal(
                tryEnableVertexFallbackOnAuth({
                    candidateModel: primaryModel,
                    failure,
                    alreadyAttemptedForModel: false,
                }),
                false
            );
        } finally {
            resetModelPoolHealth();
            if (prevUseVertex === undefined) {
                delete process.env.GOOGLE_GENAI_USE_VERTEXAI;
            } else {
                process.env.GOOGLE_GENAI_USE_VERTEXAI = prevUseVertex;
            }
            if (prevApiKey === undefined) {
                delete process.env.GEMINI_API_KEY;
            } else {
                process.env.GEMINI_API_KEY = prevApiKey;
            }
            resetAiClientState();
        }
    });
});
